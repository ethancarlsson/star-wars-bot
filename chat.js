import RoboReplier from './roboReplier.js'

const howManySpaces = (str) => {
    let numberOfSpaces = 0
    if (str) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] === ' ') {
                numberOfSpaces += 1
            }
        };    
    }
    return numberOfSpaces
};

const replier = new RoboReplier();

class Messenger {
    constructor () {
        this.message = $("#message");
        this.chat = $("#chat");
        this.messageContent = this.message.val().replace(/\r?\n/g, '<br />')
        if (this.messageContent[0] == '<') {
            this.messageContent = this.messageContent.replace('<br />', '')
        }
        this.convo = $("#conversation");
    };

    setMessageClass (message) {
        // this function checks to see if the message needs "wordbreak: breakall".
        if (howManySpaces(message) < 3) {
            return "short-message"
        };
        return "message"
    };

    sendMessage () {
        let messageClass = this.setMessageClass(this.messageContent)
        const dateTime = new Date()
        this.chat.append(`
        <div class="message-frame">
            <div class="message-box">
                <p class="${messageClass}">
                    ${this.messageContent}
                </p>
                <p class="date-time">
                    ${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}
                    ${dateTime.getHours()}:${dateTime.getMinutes()}
                </p>
            </div>
            <img src="icons/you.svg" height=70 width=70>
        </div>
        `)
        
    };

    async roboReply () {
        const reply = replier.respond(this.messageContent);
        const messageClass = this.setMessageClass(reply);
        const dateTime = new Date()
        $("#replying-message").remove()
        $("#replying").append(`
        <p id="replying-message">roboBro is writing something...</p>
    `);

        setTimeout (() => {this.chat.append(`
        <div class="message-frame">
            <img src="icons/roboBro.svg" height=70 width=70>
            <div class="robo-message-box">
                <p class="robo-${messageClass}">
                    ${reply}
                </p>
                <p class="robo-date-time">
                    ${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}
                    ${dateTime.getHours()}:${dateTime.getMinutes()}
                </p>
            </div>
        </div>
        `)
        $("#replying-message").remove()
        this.keepToBottom()
            }, 900);

    };

    keepToBottom () {
        this.convo.scrollTop($(this.convo)[0].scrollHeight);
    };
};

const runConversation = () => {
    const messenger = new Messenger();
    messenger.sendMessage();
    messenger.roboReply();
    messenger.message.val('');
    messenger.keepToBottom();
};

jQuery(() => {
    $("#send-message").on("click", () => {
        runConversation();
        });

    $("#message").on("keypress", (kPress) => {
        if (kPress.key === "Enter" && !kPress.shiftKey) {
            runConversation();
            };
    });
});
