const { sql, pool, poolConnect } = require('./db');

async function initChatDb() {
    try {
        console.log("Connecting to database...");
        await poolConnect;
        
        console.log("Checking if Messages table exists...");
        const request = pool.request();
        
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Messages' AND xtype='U')
            BEGIN
                CREATE TABLE Messages (
                    MessageID INT IDENTITY(1,1) PRIMARY KEY,
                    SenderID INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    ReceiverID INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    MessageContent NVARCHAR(MAX) NOT NULL,
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    IsRead BIT DEFAULT 0,
                    AttachmentURL NVARCHAR(MAX) NULL,
                    AttachmentName NVARCHAR(255) NULL
                );
                PRINT 'Created table Messages successfully!';
            END
            ELSE
            BEGIN
                PRINT 'Table Messages already exists!';
            END
        `);
        
        console.log("Chat database tables verified successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating chat database:", err);
        process.exit(1);
    }
}

initChatDb();
