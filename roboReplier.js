
// found the function here https://www.w3schools.com/JS/js_random.asp. Name changes are so it looks like python to me
const randInt = (start, stop) => {
    return Math.floor(Math.random() * (start + stop) ) + start;
};

const isReddit = (reply) => {
    const regex = /reddit|\w+vote|u\/|meme|post|r\/|https|www./
    if (regex.test(reply)) {
        return true
    }
    return false
}

class RoboReplier {
    constructor () {
        this.allData = ["I don’t like sand. It’s coarse and rough and irritating… and it gets everywhere."]
        this.links = [
            "https://www.reddit.com/r/PrequelMemes/comments/h93eeq/when_i_try_to_impress_this_sub_with_my_art_work.json",
            "https://www.reddit.com/r/PrequelMemes/comments/dvd1yr/art_by_jb_casacop.json",
            "https://www.reddit.com/r/PrequelMemes/comments/fp280f/this_is_my_magnum_opus_my_creme_de_la_creme.json",
            "https://www.reddit.com/r/PrequelMemes/comments/fnby1i/a_fine_addition.json",
            "https://www.reddit.com/r/PrequelMemes/comments/g15hel/every_day_general_grievous_adds_a_unique.json",
            "https://www.reddit.com/r/PrequelMemes/comments/flmmzz/i_made_a_thing.json",
            "https://www.reddit.com/r/PrequelMemes/comments/gtc9bf/i_tried_recreating_the_high_ground_scene_in.json",
            "https://www.reddit.com/r/PrequelMemes/comments/ee5qfm/weve_come_full_circle.json",
            "https://www.reddit.com/r/PrequelMemes/comments/jzh9yx/cough_cough_shards_of_the_past.json",
        ]
        this.tragedy = `Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.`
        this.getHottest()
        this.getResponses()
    };

    getHottest = () => {
        $.ajax({url: 'https://www.reddit.com/r/PrequelMemes/top.json'}).done((r) => {
            r['data']['children'].forEach(subReddit => {
                let newLink = `https://www.reddit.com/${subReddit['data']['permalink']}`
                this.links.push(newLink)
            });
        });
    };

    getReplies = (comment) => {
        const repliesToComment = comment['data']['replies']['data'];
        if (repliesToComment) {
            repliesToComment['children'].forEach(repComment => {
                if (repComment['data']['score'] >= 40) {
                    let repBody = repComment['data']['body']
                    if (repBody) {
                        if (!isReddit(repBody.toLowerCase())) {
                            this.allData.push(repBody)
                            this.getReplies(repComment)
                        };
                    };
                };
            });    
        };
    };

    getResponses = () => {
        for (const link of this.links) {
            $.ajax({
                url: link,
            }).done((r) => {
                r['1']['data']['children'].forEach(comment => {
                    let commentBody = comment['data']['body']
                    if (commentBody){
                        if (!isReddit(commentBody.toLowerCase())) {
                            this.allData.push(commentBody);
                            this.getReplies(comment);
                        };
                    };
                });
            });    
        };
    };

    respond = (que) => {
        let str = que.toLowerCase()
        const reGreet = /hello |hi |hey |^hello|^hi|^hey/;
        const reHello = /hello there/;
        const reStory = /story|tale/;
        const reKenobi = /kenobi/
        if (reHello.test(str)) {
            return "General Kenobi!"
        } else if (reGreet.test(str)) {
            return "Hello there!"
        } else if (reStory.test(str)) {
            return this.tragedy
        } else if (reKenobi.test(str)) {
            return "You are strong and wise, and I am very proud of you."
        };
        let hiNmbr = this.allData.length;
        console.log(randInt(0, hiNmbr))
        return this.allData[randInt(0, hiNmbr)]
    };

};

export default RoboReplier;