

exports.healthCheck = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Server is running properly',
            uptime: process.uptime(),
            timestamp: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};