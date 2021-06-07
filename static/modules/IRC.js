export { IRC };

class IRC {

    init() {
        let dys = this;

        document.getElementById("nick").addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                document.getElementById("data").innerHTML = "";
                dys.getNick(dys);
                dys.randomColor();
                dys.poll();
            }


        });

        document.getElementById("textMessage").addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                dys.addData();
                document.getElementById("textMessage").value = "";
            }
        });

        $(document).ready(function()
         {   
                $("#scrollbar1").tinyscrollbar();
         
        });
   

    }

    poll() {

        fetch('/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                let canBePooledAgain = true;

                for (let i = 0; i < data.length; i++) {
                    console.log(data[i])
                    if (data[i].type == "changeColor") {
                        let div = document.createElement("div");
                        div.classList = "message";

                        let spanMessage = document.createElement("span");
                        spanMessage.innerText = "Użytkownik " + data[i].nick + " zmienił kolor na " + data[i].color;
                        spanMessage.style.color = "white";
                        spanMessage.classList = "spanMessage";

                        div.appendChild(spanMessage);
                        document.getElementById("data").appendChild(div);

                    } else if (data[i].type == "changeNick") {
                        let div = document.createElement("div");
                        div.classList = "message";

                        let spanMessage = document.createElement("span");
                        spanMessage.innerText = "Użytkownik " + data[i].oldNick + " zmienił nick na " + data[i].newNick;
                        spanMessage.style.color = "white";
                        spanMessage.classList = "spanMessage";

                        div.appendChild(spanMessage);
                        document.getElementById("data").appendChild(div);
                    } else if (data[i].type == "quit") {
                        let div = document.createElement("div");
                        div.classList = "message";

                        if (this.nick == data[i].nick) {
                            canBePooledAgain = false
                        }

                        let spanMessage = document.createElement("span");
                        spanMessage.innerText = "Użytkownik " + data[i].nick + " opuścił czat";
                        spanMessage.style.color = "white";
                        spanMessage.classList = "spanMessage";

                        div.appendChild(spanMessage);
                        document.getElementById("data").appendChild(div);

                    } else {
                        let div = document.createElement("div");
                        div.classList = "message";

                        let minutes = data[i].insertTime.minutes
                        let hours = data[i].insertTime.hours

                        if (hours < 10) {
                            hours = "0" + hours;
                        }
                        if (minutes < 10) {
                            minutes = "0" + minutes;
                        }

                        let spanTime = document.createElement("span");
                        spanTime.innerText = "[" + hours + ":" + minutes + "]";
                        spanTime.style.color = "white";
                        spanTime.classList = "span";

                        let spanNick = document.createElement("span");
                        spanNick.innerText = "<@" + data[i].nick + ">";
                        spanNick.style.color = data[i].color;

                        let spanMessage = document.createElement("span");
                        spanMessage.innerText = data[i].message;
                        spanMessage.style.color = "white";
                        spanMessage.classList = "spanMessage";


                        div.appendChild(spanTime);
                        div.appendChild(spanNick);
                        div.appendChild(spanMessage);

                        document.getElementById("data").appendChild(div);
                    }
                }

                $('.spanMessage').emoticonize({});
                $('#scrollbar1').data('plugin_tinyscrollbar').update();

                if (canBePooledAgain) {
                    this.poll();
                }

            })
    }

    addData() {
        let body;
        let message = document.getElementById("textMessage").value
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let insertTime = { hours: hours, minutes: minutes };
        console.log("cos")

        if (message.substring(0, 7) == "/color ") {
            let color = message.substring(7, message.length);
            console.log(color)

            body = {
                nick: this.nick,
                color: color,
                insertTime: insertTime,
                type: "changeColor"
            }

            this.color = color;

        } else if (message.substring(0, 6) == "/nick ") {
            let nick = message.substring(6, message.length);
            console.log(nick)
            body = {
                oldNick: this.nick,
                newNick: nick,
                insertTime: insertTime,
                type: "changeNick"
            }

            this.nick = nick;

        } else if (message.substring(0, 5) == "/quit") {
            body = {
                nick: this.nick,
                insertTime: insertTime,
                type: "quit"
            }

            document.getElementById("nickContainer").style.zIndex = 90;
            document.getElementById("container").style.zIndex = -90;


        } else {
            body = {
                color: this.color,
                nick: this.nick,
                insertTime: insertTime,
                message: message,
                type: "message"
            }
        }



        fetch('/addData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

    }

    randomColor() {
        let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
            '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
            '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
            '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
            '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
            '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
            '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
            '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
            '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

        let randomNumber = Math.floor(Math.random() * 50);
        this.color = colors[randomNumber];
    }
    getNick(dys) {
        dys.nick = document.getElementById("nick").value;
        document.getElementById("nickContainer").style.zIndex = -90;
        document.getElementById("container").style.zIndex = 90;

    }


}