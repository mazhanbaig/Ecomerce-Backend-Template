function ResponseObj(status, message, data, error) {
    return {
        status,
        message,
        data,
        error
    }
}

module.exports = ResponseObj