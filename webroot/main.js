/**
 * (c)2021 Yoichi Tanibayashi
 *
 *=====================================================
 * ### Class inheritance tree ###
 *
 * MyBase .. basic class
 *    |
 *    +- TextBase .. have a text
 *    |    |
 *    |    +- OnClockText
 *    |
 *    +- ImageBase .. have a image
 *    |    |
 *    |    +- OnClockImage
 *    |    |    |
 *    |    |    +- OnClockButton
 *    |    |         |
 *    |    |         +- ResetButton
 *    |    |         +- PauseButton
 *    |    |
 *    |    +- ClockBase
 *    |         
 *    +- OnClockArea
 *         |
 *         +- PlayerArea
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
const VERSION = "0.01";

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
     * @param {string} id
     * @param {number} x, y
     * @param {number} deg
     * @param {number} w, h
     */
    constructor(id, x, y, deg=0, w=undefined, h=undefined) {
        [this.x, this.y] = [x, y];
        [this.w, this.h] = [w, h];
        this.deg = deg;
        this.id = id;
        
        if ( this.id !== undefined && this.id.length > 0 ) {
            this.el = document.getElementById(this.id);
        } else {
            this.el = undefined;
        }

        if ( w === undefined && this.el ) {
            this.w = this.el.clientWidth;
        }
        if ( h === undefined && this.el ) {
            this.h = this.el.clientHeight;
        }

        if ( this.el ) {
            this.move(this.x, this.y);
            this.rotate(this.deg);
            //this.el.style.width = this.w + "px";
            //this.el.style.height = this.h + "px";
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
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    in_this(x, y) {
        return (x >= this.x) && (x < this.x + this.w)
            && (y >= this.y) && (y < this.y + this.h);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} center - center flag
     * @param {number} sec
     */
    move(x, y, center=false, sec=0) {
        [this.x, this.y] = [x, y];

        this.el.style.transitionTimingFunction = "linear";
        this.el.style.transitionDuration = sec + "s";
        if ( center ) {
            this.el.style.left = (this.x - this.w / 2) + "px";
            this.el.style.top = (this.y - this.h / 2) + "px";
        } else {
            this.el.style.left = this.x + "px";
            this.el.style.top = this.y + "px";
        }
    } // MyBase.move()

    /**
     * @param {number} z
     */
    set_z(z) {
        this.z = z;
        this.el.style.zIndex = this.z;
    } // MyBase.set_z()

    /**
     * @param {number} deg
     */
    rotate(deg, center=false, sec=0) {
        //console.log(`rotate(deg=${deg}, center=${center}, sec=${sec})`);
        this.deg = deg;
        if ( center ) {
            this.el.style.transformOrigin = "center center";
        } else {
            this.el.style.transformOrigin = "top left";
        }
        this.el.style.transitionTimingFunction = "linear";
        this.el.style.transitionDuration = sec + "s";
        this.el.style.transform = `rotate(${this.deg}deg)`;
    } // MyBase.rotate()

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
        let [origin_x, origin_y] = [this.x, this.y];
        if ( this.board ) {
            [origin_x, origin_y] = [this.board.x, this.board.y];
        }
        
        let [x, y] = [e.pageX - origin_x, e.pageY - origin_y];

        let player = this.player;
        if ( this.board) {
            player = this.board.player;
        }
        if ( player == 1 ) {
            [x, y] = this.inverse_xy(e);
        }
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
    constructor(id, x, y, deg, text="",
                size="30px", family="sans-serif", weight="bolder") {
        super(id, x, y, deg, undefined, undefined);

        this.text = text;

        if ( this.el ) {
            this.el.innerHTML = this.text;
            // this.el.style.left = this.x + "px";
            // this.el.style.top = this.y + "px";
            this.el.style.transformOrigin = "top left";
            this.el.style.transform = `rotate(${this.deg}deg)`;
            this.el.style.fontSize = size;
            this.el.style.fontFamily = family;
            this.el.style.fontWeight = weight;
            this.el.style.lineHeight = 1.0;
            this.w = this.el.clientWidth;
            this.h = this.el.clientHeight;
        }
    } // TextBase.constructor()

    /**
     *
     */
    get() {
        if ( this.el === undefined ) {
            return "";
        }

        this.text = this.el.innerHTML;
        return this.text;
    } // TextBase.get()

    /**
     *
     */
    set(txt) {
        if ( this.el === undefined ) {
            return;
        }

        this.el.innerHTML = "";
        if ( txt.length > 0 ) {
            this.text = txt;
            this.el.innerHTML = this.text;
        }
        this.w = this.el.clientWidth;
        this.h = this.el.clientHeight;
        this.move(this.x, this.y);
        this.rotate(this.deg);
    } // TextBase.set()

    /**
     *
     */
    on() {
        if ( this.el ) {
            this.el.style.opacity = 1;
        }
    } // TextBase.on()

    /**
     *
     */
    off() {
        if ( this.el ) {
            this.el.style.opacity = 0;
        }
    } // TextBase.off()
} // class TextBase

/**
 *
 */
class OnClockText extends TextBase {
    /**
     *
     */
    constructor(id, parent, x, y, deg) {
        super(id, x, y, deg, "");
        this.parent = parent;
    } // OnClockText.constructor()
} // class OnClockText

/**
 * <div id="${id}"><image src="${image_dir}/..${image_suffix}"></div>
 */
class ImageBase extends MyBase {
    constructor(id, x, y, deg=0, w=undefined, h=undefined) {
        super(id, x, y, deg, w, h);

        this.image_parent_dir = "data";
        // this.image_suffix = ".svg";

        this.image_el = this.el.children[0];
        this.image_dir = this.get_image_dir();

        if ( w === undefined ) {
            this.w = this.image_el.width;
        }
        if ( h === undefined ) {
            this.h = this.image_el.height;
        }

        this.el.style.width = `${this.w}px`;
        this.el.style.height = `${this.h}px`;
  
        this.active = true;
        this.el.hidden = false;
        this.el.draggable = false;

        this.move(this.x, this.y, false);

        this.e = undefined; // MouseEvent
    } // ImageBase.constructor()

    /**
     * 
     */
    get_image_dir() {
        const image_src = this.image_el.src;
        console.log(`image_src=${image_src}`);
        const index1 = image_src.indexOf(this.image_parent_dir);
        console.log(`index1=${index1}`);
        const index2 = image_src.indexOf("/", index1+1);
        console.log(`index2=${index2}`);
        const index3 = image_src.indexOf("/", index2+1);
        console.log(`index3=${index3}`);

        const image_dir = image_src.slice(index1, index3+1);
        console.log(`image_dir=${image_dir}`);

        return image_dir;
    } // ImageBase.get_image_dir()

    /**
     * @param {number} w
     * @param {number} h
     */
    set_wh(w, h) {
        this.w = w;
        this.h = h;

        this.el.style.width = `${this.w}px`;
        this.el.style.height = `${this.h}px`;
    } // ImageBase.set_wh()

    /**
     * 
     */
    on() {
        this.active = true;
        this.el.hidden = false;
    } // ImageBase.on()

    /**
     * 
     */
    off() {
        this.active = false;
        this.el.hidden = true;
    } // ImageBase.off()
} // class ImageBase

/**
 *
 */
class OnClockImage extends ImageBase {
    constructor(id, parent, x, y, deg=0) {
        super(id, x, y, deg, undefined, undefined);
        this.parent = parent;
    } // OnClockImage.constructor()
} // class OnClockImage

/**
 *
 */
class OnClockButton extends OnClockImage {
    constructor(id, parent, x, y, deg=0) {
        super(id, parent, x, y, deg);
    }
} // class OnClockButton

/**
 *
 */
class ResetButton extends OnClockButton {
    constructor(id, parent, x, y, deg=0) {
        super(id, parent, x, y, deg);
    } // ResetButton.constructor()

    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}: (${x}, ${y})`);
        for (let i=0; i < 2; i++) {
            this.parent.player[i].reset();
        }
    } // ResetButton.on_mouse_down_xy()
} // class ResetButton

/**
 *
 */
class PauseButton extends OnClockButton {
    constructor(id, parent, x, y, deg=0) {
        super(id, parent, x, y, deg);
    } // PauseButton.constructor()

    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y})`);
        for (let i=0; i < 2; i++) {
            this.parent.player[i].pause();
        }
    } // PauseButton.on_mouse_down_xy()
} // class PauseButton

/**
 *
 */
class OnClockArea extends MyBase {
    constructor(id, clock_base, x, y, w, h) {
        super(id, x, y, 0, w, h);
        this.clock_base = clock_base;

        this.el.style.width = this.w + "px";
        this.el.style.height = this.h + "px";
        
        console.log(`this.w=${this.w}, ${this.el.style.width}`);
    } // OnClockArea.constructor()
} // class OnClockArea

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
    constructor(sec, id, x, y, deg=0) {
        super(sec * 1000);

        this.base = new MyBase(id, x, y, deg);
        this.text1 = new TextBase(id + "_1", 0, 0, 0, "000", "130px");
        this.text2 = new TextBase(id + "_2", 0, 0, 0, "00", "70px");
        console.log(`text1.w=${this.text1.w}`);
        this.text2.move(this.text1.w + 2, this.text1.h - this.text2.h);
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
    constructor(sec, id, x, y, deg=0) {
        super(sec * 1000);

        this.base = new MyBase(id, x, y, deg);
        this.text1 = new TextBase(id + "_1", 0, 0, 0, "00:00", "150px");
        this.text2 = new TextBase(id + "_2", 0, 0, 0, "00", "75px");
        this.text2.move(this.text1.w + 2, this.text1.h - this.text2.h);
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
class PlayerArea extends OnClockArea {
    /**
     * @param {string} player - player id string ex. "p1" or "p2"
     * 
     */
    constructor(clock_base, player, delay_sec, limit_sec, x, y, w, h) {
        super(player, clock_base, x, y, w, h);
        console.log(`this.w=${this.w}`);

        this.clock_base = clock_base;
        this.player = player;
        this.delay_sec = delay_sec;
        this.limit_sec = limit_sec;

        this.active = false;
        this.timerout = false;
        this.opponent = undefined;

        this.delay_timer = new DelayTimer(this.delay_sec, player + "delay",
                                          400, 200, 90);
        this.limit_timer = new LimitTimer(this.limit_sec, player + "limit",
                                          200, 50, 90);
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
        }
        if ( this.limit_timer.active ) {
            this.limit_timer.update();
            if ( this.limit_timer.msec <= 0 ) {
                this.limit_timer.pause();
                this.limit_timer.msec = 0;
                this.limit_timer.update();
                this.timeout = true;
            }
            this.el.style.backgroundColor = '#FCC';
        }
    } // PlayerArea.update()

    on_mouse_down_xy(x, y) {
        console.log(`${this.constructor.name}.on_mouse_down_xy(${x}, ${y})`);
        this.el.style.backgroundColor = "#4F4";

        if ( this.active || ( ! this.active && ! this.opponent.active ) ) {
            this.pause();
            /*
            this.delay_timer.reset();
            this.update();
            */
            this.opponent.delay_timer.reset();
            this.opponent.resume();
            this.clock_base.sound_push1.play();
        } else {
            this.clock_base.sound_push2.play();
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
class ClockBase extends ImageBase {
    /*
     * @param {string} id - div tag id
     * @param {number} x - 
     * @param {number} y - 
     */
    constructor(id, x, y, w=undefined, h=undefined) {
        console.log(`ClockBase(${id},${x},${y},${w},${h})`);
        super(id, x, y, 0, w, h);

        this.turn = 0;

        this.button1 = new ResetButton("button1", this, 70, 600);
        this.button1.rotate(90, true);
        this.button1.set_z(100);
        this.button2 = new PauseButton("button2", this, 70, 800);
        this.button2.set_z(100);

        this.delay_sec = [12, 12];
        this.limit_sec = [12 * 60, 12 * 60];
        let p_area_y = 30;
        let p_area_w = 450;
        let p_area_h = 620;

        this.player = [
            new PlayerArea(this, "p1",
                           this.delay_sec[0], this.limit_sec[0],
                           200, p_area_y, p_area_w, p_area_h),
            new PlayerArea(this, "p2",
                           this.delay_sec[1], this.limit_sec[1],
                           200, p_area_y + p_area_h + 5, p_area_w, p_area_h)
        ];
        this.player[0].set_opponent(this.player[1]);
        this.player[1].set_opponent(this.player[0]);

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
    constructor(clock_base, soundfile) {
        console.log("SoundBase("
                    + `soundfile=${soundfile}`);
        this.clock_base = clock_base;
        this.soundfile = soundfile;
        this.audio = new Audio(this.soundfile);
    } // SoundBase.constructor()

    /**
     * 
     */
    play(mute=false) {
        if ( this.clock_base.sound_switch ) {
            console.log(`soundfile=${this.soundfile}`);

            // 以下、黒魔術 !?
            let a = this.audio;
            setTimeout(function() {
                a.play();
            }, 1);
            this.clock_base.load_allsounds(); // 何故か必要!?

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
};

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()>start`);

    clockBase = new ClockBase("clock_base", 0, 0,
                               document.documentElement.clientWidth,
                               document.documentElement.clientHeight);
    
    setInterval(update_clock, UPDATE_INTERVAL);
}; // window.onload
