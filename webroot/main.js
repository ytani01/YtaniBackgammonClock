/**
 * (c)2021 Yoichi Tanibayashi
 *
 *=====================================================
 * ### Class inheritance tree ###
 *
 * MyBase .. basic class
 *    |
 *    +- TextBase
 *    |
 *    +- ModeButton
 *    |
 *    +- SetButton
 *    |
 *    +- ClockBase
 *    |         
 *    +- PlayerArea
 *
 * CountDownTimer
 *   |
 *   +- DelayTimer
 *   +- LimitTimer
 *
 * SoundBase .. play audio
 *
 *
 * ### has-a tree ###
 *
 * ClockBase
 *   |
 *   +- ResetButton
 *   +- PauseButton
 *   |
 *   +- PlayerArea
 *   |    |
 *   |    +- DelayTimer
 *   |    +- LimitTimer
 *   |
 *   +- SoundBase
 *
 *=====================================================
 */
const MY_NAME = "Ytani Backgammon Clock";
const VERSION = "0.2.1-cur";

const UPDATE_INTERVAL = 27; // msec

const SOUND_PUSH1 = "data/push1.mp3";
const SOUND_PUSH2 = "data/push2.mp3";
const SOUND_TICK = "";
const SOUND_ALART1 = "";
const SOUND_ALART2 = "";

/**
 * base class for Ytani Backgammon Clock
 */
class MyBase {
    /**
     *
     */
    constructor(id) {
        this.id = id;
        console.log(`id=${this.id}`);
        
        this.el = document.getElementById(this.id);
        console.log(`style=${this.el.style}`);

        if ( this.el ) {
            this.el.onmousedown = this.on_mouse_down.bind(this);
            this.el.ontouchstart = this.on_mouse_down.bind(this);
            this.el.onmouseup = this.on_mouse_up.bind(this);
            this.el.ontouchend = this.on_mouse_up.bind(this);
            this.el.onmousemove = this.on_mouse_move.bind(this);
            this.el.ontouchmove = this.on_mouse_move.bind(this);
            this.el.ondragstart = this.null_handler.bind(this);
        }
    } // MyBase.constructor()

    /**
     *
     */
    get() {
        if ( this.el ) {
            return this.el.innerHTML;
        }
        return "";
    } // MyBase.get()

    /**
     *
     */
    set(txt) {
        if ( this.el && txt ) {
            this.el.innerHTML = txt;
        }
    } // MyBase.set()

    /**
     * @param {number} z
     */
    set_z(z) {
        this.z = z;
        this.el.style.zIndex = this.z;
    } // MyBase.set_z()

    /**
     *
     */
    on(z=1000) {
        if ( this.el ) {
            this.el.style.opacity = 1;
            this.set_z(z);
        }
    } // MyBase.on()

    /**
     *
     */
    off() {
        if ( this.el ) {
            this.el.style.opacity = 0;
            this.set_z(0);
        }
    } // MyBase.off()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_down_xy(x, y) {
        // to be overridden
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_up_xy(x, y) {
        // to be overridden
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_move_xy(x, y) {
        // to be overridden
    } // MyBase.on_mouse_down_xy()

    /**
     * touch event to mouse event
     * only for get_xy() function
     *
     * @param {MouseEvent} e
     */
    touch2mouse(e) {
        // console.log(`MyBase.touch2mouse()`);
        e.preventDefault();
        if ( e.changedTouches ) {
            e = e.changedTouches[0];
        }
        return e;
    } // MyBase.touch2mouse()
    
    /**
     * @param {MouseEvent} e
     */
    get_xy(e) {
        e = this.touch2mouse(e);
        let [x, y] = [e.pageX, e.pageY];
        return [x, y];
    } // MyBase.get_xy()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_down(e) {
        let [x, y] = this.get_xy(e);

        this.on_mouse_down_xy(x, y);
    } // MyBase.on_mouse_down()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_up(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_up_xy(x, y);
    } // MyBase.on_mouse_up()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_move(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_move_xy(x, y);
    } // MyBase.on_mouse_move()

    /**
     * @param {MouseEvent} e
     */
    null_handler(e) {
        return false;
    } // MyBase.null_handler()
} // class MyBase

/**
 * <div id="${id}">text</div>
 */
class TextBase extends MyBase {
    /**
     *
     */
    constructor(id, text=undefined) {
        super(id);
        this.text = text;

        if ( this.el && this.text ) {
            this.el.innerHTML = this.text;
        }
    } // TextBase.constructor()
} // class TextBase

/**
 *
 */
class ModeButton extends MyBase {
    constructor(parent, id,) {
        super(id);
        this.parent = parent;
    } // ModeButton.constructor()

    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                    + `mode=${this.parent.mode}`);
        this.parent.ud_button.forEach(btn => {
            btn.off();
        });

        this.parent.sound_push2.play();
        
        let next_mode = "???";
        if ( this.parent.mode == "READY" ) {
            this.parent.mode = "SET";
            this.parent.ud_button.forEach(btn => {
                btn.on();
            });
            next_mode = "READY";
        } else if ( this.parent.mode == "SET" ) {
            this.parent.mode = "READY";
            next_mode = "SET";
        } else if ( this.parent.mode == "p0" || this.parent.mode == "p1" ) {
            this.parent.mode = "PAUSE";
            for (let i=0; i < 2; i++) {
                this.parent.player[i].pause();
            }
            next_mode = "RESET";
        } else if ( this.parent.mode == "PAUSE" ) {
            this.parent.mode = "READY";
            for (let i=0; i < 2; i++) {
                this.parent.player[i].reset();
            }
            next_mode = "SET";
        } else {
            console.log(`${this.constructor.name}.on_mouse_xy():`
                        + `unknown mode:${this.parent.mode}`);
        }
        this.set(next_mode);
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                    + `mode->${this.parent.mode}`);
    } // ModeButton.on_mouse_down_xy()
} // class ModeButton

/**
 *
 */
class SetButton extends MyBase {
    /**
     *
     */
    constructor(parent, player, timer, updown) {
        super(`${player}-${timer}-${updown}`);

        this.parent = parent;
        this.timer = timer;
        this.player = player;
        this.updown = updown;

        this.player_idx = Number(player.slice(-1));
        console.log(`player_idx=${this.player_idx}`);

        if ( this.timer == "delay" ) {
            this.target_timer = this.parent.player[this.player_idx].delay_timer;
        } else {
            this.target_timer = this.parent.player[this.player_idx].limit_timer;
        }
        // console.log(`target_timer=${this.target_timer}`);

    } // SetButton.constructor()

    /**
     *
     */
    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                    + `mode=${this.parent.mode}`);

        if ( this.parent.mode != "SET" ) {
            console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                        + " .. ignored");
            return;
        }
        
        let target_val = this.target_timer.msec0;
        let prev_target_val = target_val;
        console.log(`target_val=${target_val}`);

        if ( this.updown == "up" ) {
            if ( this.timer == "delay" ) {
                target_val += 1000;
            } else {
                target_val += 30 * 1000;
            }
        } else {
            if ( this.timer == "delay" ) {
                target_val -= 1000;
            } else {
                target_val -= 30 * 1000;
            }
            if ( target_val <= 0 ) {
                target_val = prev_target_val;
            }
        }
        console.log(`target_val=${target_val}`);
        this.target_timer.msec0 = target_val;
        this.target_timer.msec = target_val;
        this.target_timer.setStr();
    } // SetButton.on_mouse_down_xy()
} // class SetButton

/**
 *
 */
class CountDownTimer {
    /**
     *
     */
    constructor(msec) {
        console.log(`CountDownTimer(msec=${msec})`);

        this.msec = msec;  // remain
        this.msec0 = msec; // initial value
        this.active = false;
        this.start_msec = undefined;
        this.start_time = undefined;
    } // CountDownTimer.constructor()

    /**
     *
     */
    set(msec) {
        this.msec = msec;
    } // CountDownTimer.set()

    /**
     *
     */
    update() {
        if ( this.active ) {
            this.msec
                = this.start_msec - ((new Date().getTime()) - this.start_time);
        }
        //console.log(`msec=${this.msec}`);
        return this.msec;
    } // CountDownTimer.get()

    /**
     *
     */
    resume() {
        if ( this.active ) {
            return;
        }

        this.start_time = new Date().getTime();
        this.start_msec = this.msec;
        this.active = true;
    } // CountDownTimer.resume()
    
    /**
     *
     */
    pause() {
        this.active = false;
        this.update();
    } // CountDownTimer.pause()

    /**
     *
     */
    reset() {
        this.msec = this.msec0;
        this.start_msec = this.msec;
        this.pause();
        return this.msec;
    } // CountDownTimer.reset()
    
    /**
     *
     */
    start() {
        this.reset();
        this.update();
        return this.resume();
    } // CountDownTimer.start()

    /**
     *
     */
    stop() {
        return this.pause();
    } // CountDownTimer.stop()

} // class CountDownTimer

/**
 *
 */
class DelayTimer extends CountDownTimer {
    /**
     *
     */
    constructor(player, sec=12) {
        super(sec * 1000);

        this.text1 = new TextBase(player + "-delay-sec");
        this.text2 = new TextBase(player + "-delay-sec2");
        console.log(`${this.text1.get()} ${this.text2.get()}`);
        this.setStr();
    } // DelayTimer.constructor()

    /**
     *
     */
    update() {
        super.update();
        this.setStr();
    } // DelayTimer.update()

    /**
     *
     */
    setStr() {
        let sec = Math.floor(this.msec / 1000);
        let sec2 = Math.floor((this.msec - sec * 1000) / 10);
        //console.log(`sec2=${sec2}`);

        this.text1.set(('000' + sec).slice(-3));
        this.text2.set(('00' + sec2).slice(-2));
    } // DelayTimer.setStr()
} // class DelayTimer

/**
 *
 */
class LimitTimer extends CountDownTimer {
    /**
     *
     */
    constructor(player, sec=(12*60)) {
        super(sec * 1000);

        this.text1 = new TextBase(player + "-limit-sec");
        this.text2 = new TextBase(player + "-limit-sec2");
        this.setStr();
    } // LimitTimer.constructor()

    /**
     *
     */
    update() {
        super.update();
        this.setStr();
    } // LimitTimer.update();

    /**
     *
     */
    setStr() {
        let sec = Math.floor(this.msec / 1000);
        let sec2 = Math.floor((this.msec - sec * 1000) / 10);
        //console.log(`sec2=${sec2}`);
        let min = Math.floor(sec / 60);
        sec = sec - min * 60;

        let min_str = ('00' + min).slice(-2);
        let sec_str = ('00' + sec).slice(-2);
        let sec2_str = ('00' + sec2).slice(-2);

        this.text1.set(`${min_str}:${sec_str}`);
        this.text2.set(sec2_str);
    } // LimitTimer.setStr()
} // class LimitTimer

/**
 *
 */
class PlayerArea extends MyBase {
    /**
     * @param {string} player - player id string ex. "p0" or "p1"
     */
    constructor(parent, player, delay_sec, limit_sec) {
        super(player);

        this.parent = parent;
        this.player = player;
        this.delay_sec = delay_sec;
        this.limit_sec = limit_sec;

        this.active = false;
        this.timerout = false;
        this.opponent = undefined;

        this.delay_timer = new DelayTimer(this.player, this.delay_sec);
        this.limit_timer = new LimitTimer(this.player, this.limit_sec);
        this.reset();
        this.set_z(101);
    } // PlayerArea.constructor()

    /**
     *
     */
    set_opponent(player_area) {
        this.opponent = player_area;
    } // PlayerArea.set_opponent
    
    /**
     *
     */
    pause() {
        this.active = false;
        this.delay_timer.pause();
        this.limit_timer.pause();
    } // PlayerArea.pause();

    /**
     *
     */
    resume() {
        this.active = true;
        if ( this.delay_timer.msec > 0 ) {
            this.delay_timer.resume();
        } else {
            this.limit_timer.resume();
        }
    } // PlayerArea.resume()

    /**
     *
     */
    reset() {
        this.active = false;
        this.delay_timer.reset();
        this.limit_timer.reset();
        this.el.style.backgroundColor = '#EEE';
    } // PlayerArea.reset()

    /**
     *
     */
    update() {
        if ( this.delay_timer.active ) {
            this.delay_timer.update();
            if (this.delay_timer.msec <= 0) {
                this.delay_timer.pause();
                this.limit_timer.msec += this.delay_timer.msec;
                console.log(`${this.delay_timer.msec}, ${this.limit_timer.msec}`);

                this.delay_timer.msec = 0;
                this.delay_timer.update();
                console.log(`${this.delay_timer.msec}`);

                this.limit_timer.resume();
            }
            this.el.style.backgroundColor = '#FFA';
            this.opponent.el.style.backgroundColor = '#AAA';
        }
        if ( this.limit_timer.active ) {
            this.limit_timer.update();
            if ( this.limit_timer.msec <= 0 ) {
                this.limit_timer.pause();
                this.limit_timer.msec = 0;
                this.limit_timer.update();
                this.timeout = true;
                this.parent.mode = "PAUSE";
                this.parent.btn_mode.set("RESET");
            }
            this.el.style.backgroundColor = '#FCC';
            this.opponent.el.style.backgroundColor = '#AAA';
        }
    } // PlayerArea.update()

    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                    + `mode=${this.parent.mode}`);
        if ( this.parent.mode == "SET" ) {
            console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y}):`
                        + ` ... ignored`);
            return;
        }

        this.el.style.backgroundColor = "#4F4";

        if ( this.active || ( ! this.active && ! this.opponent.active ) ) {
            this.parent.sound_push1.play();

            this.pause();
            this.opponent.delay_timer.reset();
            this.opponent.resume();

            this.parent.mode = this.opponent.player;
            this.parent.btn_mode.set("PAUSE");
            console.log(`${this.constructor.name}.on_mouse_down_xy():`
                        + `mode=${this.parent.mode}`);
        } else {
            this.parent.sound_push2.play();
        }
    } // PlayerArea.on_mouse_down_xy()

    on_mouse_up_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_up_xy(${x}, ${y})`);
        this.el.style.backgroundColor = "transparent";
        this.el.style.backgroundColor = '#EEE';
    } // PlayerArea.on_mouse_up_xy()
} // class PlayerArea

/**
 *
 */
class ClockBase extends MyBase {
    /*
     * @param {string} id - div tag id
     */
    constructor(id) {
        super(id);

        this.turn = 0;

        this.delay_sec = [12, 12];
        this.limit_sec = [12 * 60, 12 * 60];

        this.mode = "READY";

        // players
        this.player = [
            new PlayerArea(this, "p0",
                           this.delay_sec[0], this.limit_sec[0]),
            new PlayerArea(this, "p1",
                           this.delay_sec[1], this.limit_sec[1])
        ];
        this.player[0].set_opponent(this.player[1]);
        this.player[0].set_z(50);
        this.player[1].set_opponent(this.player[0]);
        this.player[1].set_z(50);

        // buttons
        this.btn_mode = new ModeButton(this, "btn-mode");
        this.btn_mode.set("SET");

        this.btn_p0_delay_up   = new SetButton(this, "p0", "delay", "up");
        this.btn_p0_delay_down = new SetButton(this, "p0", "delay", "down");
        this.btn_p0_limit_up   = new SetButton(this, "p0", "limit", "up");
        this.btn_p0_limit_down = new SetButton(this, "p0", "limit", "down");
        this.btn_p1_delay_up   = new SetButton(this, "p1", "delay", "up");
        this.btn_p1_delay_down = new SetButton(this, "p1", "delay", "down");
        this.btn_p1_limit_up   = new SetButton(this, "p1", "limit", "up");
        this.btn_p1_limit_down = new SetButton(this, "p1", "limit", "down");

        this.ud_button = [
            this.btn_p0_delay_up,
            this.btn_p0_delay_down,
            this.btn_p0_limit_up,
            this.btn_p0_limit_down,
            this.btn_p1_delay_up,
            this.btn_p1_delay_down,
            this.btn_p1_limit_up,
            this.btn_p1_limit_down
        ];

        this.ud_button.forEach(btn => {
            btn.off();
        });

        // sounds
        this.sound_push1 = new SoundBase(this, SOUND_PUSH1);
        this.sound_push2 = new SoundBase(this, SOUND_PUSH2);

        this.sound_switch = true;
        
        this.active = false;
    } // ClockBase.constructor()

    /**
     * ??
     */
    load_allsounds() {
        this.sound_push1.audio.load();
        this.sound_push2.audio.load();
    }
    
    /**
     * @param {number} player - 0 or 1
     */
    set_turn(player) {
        this.turn = player;
        return this.turn;
    } // ClockBase.set_turn()

    /**
     *
     */
    change_turn() {
        this.player_timer[this.turn].update();
        this.player_timer[this.turn].pause();
        console.log(`${this.player_timer[this.turn].str()}`);

        this.set_turn(1 - this.turn);
        if ( this.active ) {
            this.player_timer[this.turn].start();
        }
        console.log(`${this.player_timer[this.turn].str()}`);
    } // ClockBase.change_turn()

    /**
     *
     */
    resume() {
        this.active = true;
        this.player_timer[this.turn].start();
    } // ClockBase.start()

    /**
     *
     */
    pause() {
        this.active = false;
        this.player_timer[0].pause();
        this.player_timer[1].pause();
    }
    
} // class ClockBase

/**
 *
 */
class SoundBase {
    constructor(parent, soundfile) {
        console.log("SoundBase("
                    + `soundfile=${soundfile}`);
        this.parent = parent;
        this.soundfile = soundfile;
        this.audio = new Audio(this.soundfile);
    } // SoundBase.constructor()

    /**
     * 
     */
    play(mute=false) {
        if ( this.parent.sound_switch ) {
            console.log(`soundfile=${this.soundfile}`);

            // 以下、黒魔術 !?
            let a = this.audio;
            setTimeout(function() {
                a.play();
            }, 1);
            this.parent.load_allsounds(); // 何故か必要!?

            return true;
        } else {
            return false;
        }
    } // SoundBase.play()
} // class SoundBase

let clockBase;

/**
 *
 */
const update_clock = () => {
    for (let i=0; i < 2; i++) {
        if ( clockBase.player[i].active ) {
            clockBase.player[i].update();
        }
    }
}; // update_clock()

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()>start`);

    new TextBase("version-str", `${MY_NAME}, Version ${VERSION}`);

    clockBase = new ClockBase("clock-base", 0, 0,
                               document.documentElement.clientWidth,
                               document.documentElement.clientHeight);
    
    setInterval(update_clock, UPDATE_INTERVAL);
}; // window.onload
