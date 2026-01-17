// 自定义错误类
class AppError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// 错误处理函数
const handleError = (err, ctx) => {
    console.log('=== 进入错误处理函数 ===');
    console.log('原始错误对象:', err);
    console.log('错误名称:', err.name);
    console.log('错误类型:', typeof err);
    console.log('是否为AppError实例:', err instanceof AppError);
    
    let statusCode = err.statusCode;
    let message = err.message;
    
    console.log('从错误对象提取的statusCode:', statusCode);
    console.log('从错误对象提取的message:', message);
    
    // 默认值
    if (!statusCode) {
        statusCode = 500;
        console.log('使用默认statusCode:', statusCode);
    }
    if (!message) {
        message = 'Internal Server Error';
        console.log('使用默认message:', message);
    }
    
    // 生产环境下隐藏详细错误信息
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
        console.log('生产环境下使用默认错误信息');
    }
    
    // 设置响应
    console.log('设置响应状态码:', statusCode);
    ctx.status = statusCode;
    console.log('设置响应体:', {
        status: statusCode >= 500 ? 'error' : 'fail',
        message
    });
    ctx.body = {
        status: statusCode >= 500 ? 'error' : 'fail',
        message
    };
    
    console.log('=== 错误处理函数结束 ===');
};

// 处理Sequelize错误
const handleSequelizeError = (err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors || [];
        const field = errors.length > 0 ? errors[0].path : '';
        
        let message;
        if (field === 'phone') {
            message = 'Phone number already exists';
        } else if (field === 'email') {
            message = 'Email already exists';
        } else if (field === 'username') {
            message = 'Username already exists';
        } else {
            message = 'Duplicate entry';
        }
        
        return new AppError(400, message);
    }
    
    if (err.name === 'SequelizeValidationError') {
        const message = err.errors.map(error => error.message).join(', ');
        return new AppError(400, `Validation error: ${message}`);
    }
    
    if (err.name === 'SequelizeDatabaseError') {
        return new AppError(400, 'Database error');
    }
    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return new AppError(400, 'Foreign key constraint error');
    }
    
    return err;
};

module.exports = {
    AppError,
    handleError,
    handleSequelizeError
};
