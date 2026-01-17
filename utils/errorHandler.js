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
    let { statusCode, message } = err;
    
    // 默认值
    if (!statusCode) statusCode = 500;
    if (!message) message = 'Internal Server Error';
    
    // 生产环境下隐藏详细错误信息
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }
    
    // 设置响应
    ctx.status = statusCode;
    ctx.body = {
        status: statusCode >= 500 ? 'error' : 'fail',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    
    // 记录错误日志
    console.error('Error:', {
        statusCode,
        message,
        stack: err.stack,
        url: ctx.request.url,
        method: ctx.request.method,
        ip: ctx.ip
    });
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
