#!/bin/bash
echo ""

# 输出当前时间
date --date='0 days ago' "+%Y-%m-%d %H:%M:%S"
echo "Start"

# 判断宝塔WebHook参数是否存在
#if [ ! -n "$1" ];
#then
#     echo "param参数错误"
#     echo "End"
#     exit
#fi

# git项目路径，这里设置你打算存放项目代码的文件路径
gitPath="/www/wwwroot/node/"
# git 网址, 这里设置里git仓库的地址
gitHttp="git@gitee.com:baosc_cn/workspace-server.git"

echo "Web站点路径：$gitPath"

# 判断项目路径是否存在
if [ -d "$gitPath" ]; then
    cd $gitPath
    # 判断是否存在git目录
    if [ ! -d "workspace-server" ]; then
        echo "在该目录下克隆 git"
        git clone -b main $gitHttp
    fi
    
    # 这里也需要修改成你项目代码的路径
    cd /www/wwwroot/node/workspace-server
    
    echo "" >> nohup.out
    echo "" >> nohup.out
    echo "配置安全目录开始" >> nohup.out
    
    git config --global --add safe.directory /www/wwwroot/node/workspace-server >> nohup.out
    
    chown -R $(whoami):$(whoami) /www/wwwroot/node/workspace-server >> nohup.out
    
    echo "配置安全目录结束" >> nohup.out
    
    # 切换到 main 分支， 这里需要在你的项目建立main分支
    git checkout main
    
    # 获取当前分支名
    currentBranch=$(git rev-parse --abbrev-ref HEAD)
    echo "当前分支：$currentBranch"
    
    #if [ "$currentBranch" != "main" ]; then
    #  echo "当前分支不是 main，跳过更新操作"
    #  echo "End"
    # exit
    #fi
    
    # 检查远程是否有更新
    echo "检查远程更新..."
    git fetch origin main
    localHash=$(git rev-parse HEAD)
    remoteHash=$(git rev-parse origin/main)
    
    echo "本地提交哈希: $localHash"
    echo "远程提交哈希: $remoteHash"
    
    if [ "$localHash" != "$remoteHash" ]; then
        # 设置目录权限
        chown -R www:www $gitPath
        
        echo "" >> nohup.out
        echo "" >> nohup.out
        
        echo "配置安全目录开始" >> nohup.out
        
        git config --global --add safe.directory /www/wwwroot/node/workspace-server >> nohup.out
        
        chown -R $(whoami):$(whoami) /www/wwwroot/node/workspace-server >> nohup.out
        
        echo "配置安全目录结束" >> nohup.out
        
        echo "重置git仓库状态为远程仓库的main开始" >> nohup.out
        
        # 拉取最新的项目文件
        git reset --hard origin/main >> nohup.out 2>&1
        
        echo "重置git仓库状态为远程仓库的main结束" >> nohup.out
        
        date --date='0 days ago' "+%Y-%m-%d %H:%M:%S" >> nohup.out
        echo "开始拉取代码..." >> nohup.out
        echo "执行 git pull..." >> nohup.out
        git pull >> nohup.out 2>&1
    else
        echo "没有检测到远程更新，跳过git pull操作"
    fi
    
    # 安装依赖
    echo "安装项目依赖..."
    pnpm install || {
        echo "依赖安装失败"
    }
    
    # 构建项目
    echo "构建项目..."
    pnpm run build || {
        echo "项目构建失败"
    }
    
    echo "重启宝塔Node项目..."
    
    # 通过PID文件重启Node项目
    PID_FILE="/www/server/nodejs/vhost/pids/workspace_server.pid"
    
    # 检查PID文件是否存在
    if [ -f "$PID_FILE" ]; then
        PID=$(cat $PID_FILE)
        
        echo "PID文件存在，读取PID: $PID"
        
        # 检查PID对应的进程是否存在
        if ps -p $PID > /dev/null 2>&1; then
            echo "进程 $PID 正在运行，终止进程..."
            kill $PID || {
                echo "终止进程失败，尝试强制终止..."
                kill -9 $PID || {
                    echo "强制终止进程失败"
                    # 继续执行，尝试启动新进程
                }
            }
            # 等待进程终止
            sleep 2
        else
            echo "PID $PID 对应的进程不存在"
        fi
        
        # 删除旧的PID文件
        rm -f $PID_FILE || {
            echo "删除旧PID文件失败"
            # 继续执行
        }
    else
        echo "PID文件不存在，直接启动新进程"
    fi
    
    echo "启动新的Node进程..."
    
    # 调用指定的启动脚本
    sh /www/server/nodejs/vhost/scripts/workspace_server.sh > /dev/null 2>&1
    
    # 获取背景进程PID
    START_SCRIPT_PID=$!
    
    # 等待启动脚本执行完成，最多等待10秒
    echo "等待启动脚本执行完成..."
    for i in {1..10}; do
        if ! ps -p $START_SCRIPT_PID > /dev/null 2>&1; then
            echo "启动脚本已执行完成"
            break
        fi
        sleep 1
    done
    
    # 检查PID文件是否生成
    if [ -f "$PID_FILE" ]; then
        NEW_PID=$(cat $PID_FILE)
        # 验证新进程是否正在运行
        if ps -p $NEW_PID > /dev/null 2>&1; then
            echo "新进程启动成功，PID: $NEW_PID"
        else
            echo "新进程启动失败，PID文件存在但进程不存在"
            exit 1
        fi
    else
        echo "新进程启动失败，未生成PID文件"
        exit 1
    fi
    
    echo "Node项目重启命令已执行"
    echo "项目部署成功！"
    echo "End"
    exit
else
    echo "该项目路径不存在"
    echo "End"
    exit
fi
