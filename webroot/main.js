/**
 *=====================================================
 * [Class inheritance tree]
 *
 * MyBase .. have (x, y, w, h), without image
 *    |
 *    +- TextBase .. have a text
 *    |    |
 *    |    +- OnClockText .. on board
 *    |         |
 *    |         +- ClockLimit
 *    |         |
 *    |         +- PlayerText .. owned by player
 *    |              |
 *    |              +- PlayerTimer
 *    |              +- PlayerName
 *    |              +- PlayerPipCount
 *    |              +- PlayerScore
 *    |
 *    +- ImageBase .. have a image, mouse handlers
 *    |    |
 *    |    +- OnClockImage .. on board
 *    |    |    |
 *    |    |    +- OnClockButton
 *    |    |    |    |
 *    |    |    |    +- InverseButton XXX
 *    |    |    |    +- ResignButton XXX
 *    |    |    |    |
 *    |    |    |    +- EmitButton XXX
 *    |    |    |         |
 *    |    |    |         +- BackButton
 *    |    |    |         +- Back2Button
 *    |    |    |         +- BackAllButton
 *    |    |    |         +- FwdButton 
 *    |    |    |         +- Fwd2Button 
 *    |    |    |         +- FwdAllButton 
 *    |    |    |
 *    |    |    +- PlayerItem .. owned by player
 *    |    |         |
 *    |    |         +- ScoreButton
 *    |    |         |
 *    |    |         +- BannerButton
 *    |    |         |    |
 *    |    |         |    +- RollButton
 *    |    |         |    +- PassButton
 *    |    |         |    +- ResignBannerButton
 *    |    |         |    +- WinButton
 *    |    |
 *    |    +- BgClock
 *    |         
 *    +- OnClockArea .. on clock
 *         |
 *         +- PlayerArea
 *
 * CountDownTimer .. sec, start, stop
 *   |
 *   +- DelayTimer
 *   |
 *   +- LimitTimer
 *
 * SoundBase .. play audio
 *
 *=====================================================
 */
const MY_NAME = "Ytani Backgammon Clock";
const VERSION = "0.01";

let GlobalSoundSwitch = undefined;
const SOUND_PUSH = "";
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
     * only for get_xy() function
     *
     * @param {MouseEvent} e
     */
    inverse_xy(e) {
        let [origin_x, origin_y] = [this.x, this.y];
        let [w, h] = [this.w, this.h];
        if ( this.board ) {
            [origin_x, origin_y] = [this.board.x, this.board.y];
            [w, h] = [this.board.w, this.board.h];
        }
        
        return [w - e.pageX + origin_x, h - e.pageY + origin_y];
    } // MyBase.inverse_xy()

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
        this.set_z(100);
    }
} // class OnClockButton

/**
 *
 */
class StartButton extends OnClockButton {
    constructor(id, parent, x, y) {
        super(id, parent, x, y);
    } // StartButton.constructor()

    on_mouse_down_xy(x, y) {
        console.log(`StartButton: (${x}, ${y})`);
        this.parent.player[0].delay_timer.start();
    } // StartButton.on_mouse_down_xy()
} // class StartButton

/**
 *
 */
class PauseButton extends OnClockButton {
    constructor(id, parent, x, y) {
        super(id, parent, x, y);
    } // PauseButton.constructor()

    on_mouse_down_xy(x, y) {
        console.log(`PauseButton: (${x}, ${y})`);

        if ( this.parent.player[0].delay_timer.active ) {
            this.parent.player[0].delay_timer.pause();
        } else {
            this.parent.player[0].delay_timer.resume();
        }
    } // PauseButton.on_mouse_down_xy()
} // class PauseButton

/**
 *
 */
class BgClock extends ImageBase {
    /*
     * @param {string} id - div tag id
     * @param {number} x - 
     * @param {number} y - 
     */
    constructor(id, x, y) {
        console.log(`BgClock(id=${id},x=${x},y=${y})`);
        super(id, x, y, 0, undefined, undefined);

        this.turn = 0;

        this.delay_msec = [12000, 12000];
        this.limit_msec = [12 * 60000, 12 * 60000];
        
        let p_area_w = 500;
        let p_area_h = 650;

        this.player = [
            new PlayerArea("p1", this, 200, 20, p_area_w, p_area_h),
            new PlayerArea("p2", this, 200, p_area_h + 10, p_area_w, p_area_h)
        ]

        /*
        this.p1 = new MyBase("p1", 0, 0);
        this.p1delay = new DelayTimer(12, "p1delay", 600, 300, 90);
        this.p1limit = new LimitTimer(120, "p1limit", 400, 100, 90);
        */

        /*
        this.p2 = new MyBase("p2", 0, 0);
        this.p2delay = new DelayTimer(12, "p2delay", 600, 900, 90);
        this.p2limit = new LimitTimer(120, "p2limit", 400, 700, 90);
        */

        const update_clock = () => {
            this.player[0].delay_timer.update();
        };
        setInterval(update_clock, 10);
        
        this.button1 = new StartButton("button1", this, 100, 100);
        this.button2 = new PauseButton("button2", this, 160, 100);

        
        this.active = false;
    } // BgClock.constructor()

    /**
     * @param {number} player - 0 or 1
     */
    set_turn(player) {
        this.turn = player;
        return this.turn;
    } // BgClock.set_turn()

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
    } // BgClock.change_turn()

    /**
     *
     */
    resume() {
        this.active = true;
        this.player_timer[this.turn].start();
    } // BgClock.start()

    /**
     *
     */
    pause() {
        this.active = false;
        this.player_timer[0].pause();
        this.player_timer[1].pause();
    }
    
} // class BgClock

/**
 *
 */
class OnClockArea extends MyBase {
    constructor(id, bg_clock, x, y, w, h) {
        super(id, x, y, 0, w, h);
        this.bg_clock = bg_clock;

        this.el.style.width = this.w + "px";
        this.el.style.height = this.h + "px";
        
        console.log(`this.w=${this.w}, ${this.el.style.width}`);
    } // BgClockArea.constructor()
} // class OnClockArea

/**
 *
 */
class PlayerArea extends OnClockArea {
    /**
     * @param {string} player - player id string ex. "p1" or "p2"
     * 
     */
    constructor(player, bg_clock, x, y, w, h) {
        super(player, bg_clock, x, y, w, h);
        console.log(`this.w=${this.w}`);

        this.player = player;

        this.delay_timer = new DelayTimer(12, player + "delay", 400, 200, 90);
        this.limit_timer = new LimitTimer(12 * 60, player + "limit", 200, 50, 90);
    } // PlayerArea.constructor()

    on_mouse_down_xy(x, y) {
        this.el.style.backgroundColor = "#ff0";
    }

    on_mouse_up_xy(x, y) {
        this.el.style.backgroundColor = "transparent";
    }
} // class PlayerArea

/**
 *
 */
class SoundBase {
    constructor(bg_clock, soundfile) {
        console.log("SoundBase("
                    + `soundfile=${soundfile}`);
        this.bg_clock = bg_clock;
        this.soundfile = soundfile;
        this.audio = new Audio(this.soundfile);
    } // SoundBase.constructor()

    /**
     * 
     */
    play() {
        console.log(`SoundBase.play>`
                    + `GlobalSoundSwitch=${GlobalSoundSwitch}`);
        if ( this.bg_clock.sound && GlobalSoundSwitch === undefined ) {
            console.log(`soundfile=${this.soundfile}`);
            return this.audio.play();
        } else {
            return false;
        }
    } // SoundBase.play()
} // class SoundBase

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
        this.update();
        this.active = false;
    } // CountDownTimer.pause()

    /**
     *
     */
    reset() {
        this.msec = this.msec0;
        this.start_msec = this.msec;
        this.start_time = new Date().getTime();
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
        this.text1 = new TextBase(id + "_1", 0, 0, 0, "000", "120px");
        this.text2 = new TextBase(id + "_2", 0, 0, 0, "00", "60px");
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
    }

    /**
     *
     */
    setStr() {
        let sec = Math.floor(this.msec / 1000);
        let sec2 = Math.floor((this.msec - sec * 1000) / 10);
        //console.log(`sec2=${sec2}`);

        this.text1.set(('000' + sec).slice(-3));
        this.text2.set(('00' + sec2).slice(-2));
    } // CountDownTimer.setStr()
} // class CountDownTimer

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
    } // DelayTimer.constructor()

    /**
     *
     */
    update() {
        super.update();
        this.setStr();
    }

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
    } // CountDownTimer.setStr()

    /**
     *
     */
    toStr() {
        let sec = this.msec / 1000;
        let min = Math.floor(sec / 60);
        sec = sec - min * 60;

        min = ('00' + min).slice(-3);
        sec = ('0' + sec.toFixed(2)).slice(-5);

        let timer_str = `${min}:${sec}`;
        return timer_str;
    } // CountDownTimer.toStr()
} // class CountDownTimer

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()>start`);

    // initialize Clock
    bg_clock = new BgClock("bg_clock", 5, 5);
}; // window.onload
