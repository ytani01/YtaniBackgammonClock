/**
 *=====================================================
 * [Class inheritance tree]
 *
 * BgClockBase .. have (x, y, w, h), without image
 *    |
 *    +- BgClockText .. have a text
 *    |    |
 *    |    +- BoardText .. on board
 *    |         |
 *    |         +- ClockLimit
 *    |         |
 *    |         +- PlayerText .. owned by player
 *    |              |
 *    |              +- PlayerClock
 *    |              +- PlayerName
 *    |              +- PlayerPipCount
 *    |              +- PlayerScore
 *    |
 *    +- BgClockImage .. have a image, mouse handlers
 *    |    |
 *    |    +- OnBoardImage .. on board
 *    |    |    |
 *    |    |    +- OnBoardButton
 *    |    |    |    |
 *    |    |    |    +- InverseButton
 *    |    |    |    +- ResignButton
 *    |    |    |    |
 *    |    |    |    +- EmitButton
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
 *    +- BgClockButtonArea
 *
 * CountDownTimer .. sec, start, stop
 *   |
 *   +- DelayTime
 *   |
 *   +- LimitTime
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
class BgClockBase {
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
            this.el.onmousedown = this.on_mouse_down.bind(this);
            this.el.ontouchstart = this.on_mouse_down.bind(this);
            this.el.onmouseup = this.on_mouse_up.bind(this);
            this.el.ontouchend = this.on_mouse_up.bind(this);
            this.el.onmousemove = this.on_mouse_move.bind(this);
            this.el.ontouchmove = this.on_mouse_move.bind(this);
            this.el.ondragstart = this.null_handler.bind(this);
        }
    } // BgClockBase.constructor()

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
    } // BgClockBase.move()

    /**
     * @param {number} z
     */
    set_z(z) {
        this.z = z;
        this.el.style.zIndex = this.z;
    } // BgClockBase.set_z()

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
    } // BgClockBase.rotate()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_down_xy(x, y) {
        // to be overridden
    } // BgClockBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_up_xy(x, y) {
        // to be overridden
    } // BgClockBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_move_xy(x, y) {
        // to be overridden
    } // BgClockBase.on_mouse_down_xy()

    /**
     * touch event to mouse event
     * only for get_xy() function
     *
     * @param {MouseEvent} e
     */
    touch2mouse(e) {
        // console.log(`BgClockBase.touch2mouse()`);
        e.preventDefault();
        if ( e.changedTouches ) {
            e = e.changedTouches[0];
        }
        return e;
    } // BgClockBase.touch2mouse()
    
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
    } // BgClockBase.inverse_xy()

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
    } // BgClockBase.get_xy()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_down(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_down_xy(x, y);
    } // BgClockBase.on_mouse_down()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_up(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_up_xy(x, y);
    } // BgClockBase.on_mouse_up()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_move(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_move_xy(x, y);
    } // BgClockBase.on_mouse_move()

    /**
     * @param {MouseEvent} e
     */
    null_handler(e) {
        return false;
    } // BgClockBase.null_handler()
} // class BgClockBase

/**
 * <div id="${id}"><image src="${image_dir}/..${image_suffix}"></div>
 */
class BgClockImage extends BgClockBase {
    constructor(id, x, y, deg=0, w=undefined, h=undefined) {
        super(id, x, y, deg, w, h);

        this.image_parent_dir = "data";
        this.image_suffix = ".svg";

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
    } // BgClockImage.constructor()

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
    } // BgClockImage.get_image_dir()

    /**
     * @param {number} w
     * @param {number} h
     */
    set_wh(w, h) {
        this.w = w;
        this.h = h;

        this.el.style.width = `${this.w}px`;
        this.el.style.height = `${this.h}px`;
    } // BgClockImage.set_wh()

    /**
     * 
     */
    on() {
        this.active = true;
        this.el.hidden = false;
    } // BgClockImage.on()

    /**
     * 
     */
    off() {
        this.active = false;
        this.el.hidden = true;
    } // BgClockImage.off()
} // class BgClockImage

/**
 *
 */
class BgClock extends BgClockImage {
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
        
        this.player_clock = [
            new PlayerClock(this.delay_msec[0], this.limit_msec[0]),
            new PlayerClock(this.delay_msec[1], this.limit_msec[1])
        ];
        
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
        this.player_clock[this.turn].update();
        this.player_clock[this.turn].pause();
        console.log(`${this.player_clock[this.turn].str()}`);

        this.set_turn(1 - this.turn);
        if ( this.active ) {
            this.player_clock[this.turn].start();
        }
        console.log(`${this.player_clock[this.turn].str()}`);
    } // BgClock.change_turn()

    /**
     *
     */
    resume() {
        this.active = true;
        this.player_clock[this.turn].start();
    } // BgClock.start()

    /**
     *
     */
    pause() {
        this.active = false;
        this.player_clock[0].pause();
        this.player_clock[1].pause();
    }
    
} // class BgClock

/**
 *
 */
class BgClockArea extends BgClockBase {
    constructor(id, bg_clock, x, y, w, h) {
        super(id, x, y, 0, w, h);
        this.bg_clock = bg_clock;
    } // BgClockArea.constructor()
} // class BgClockArea

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

        this.msec = msec;
        this.msec0 = msec;
        this.active = false;
        this.start_msec = undefined;
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
            this.msec = this.msec0 - ((new Date().getTime()) - this.start_msec);
        }
        console.log(`msec=${this.msec}`);
        return this.msec;
    } // CountDownTimer.get()

    /**
     *
     */
    resume() {
        if ( this.active ) {
            return;
        }

        this.start_msec = new Date().getTime();
        this.active = true;
    } // CountDownTimer.resume()
    
    /**
     *
     */
    pause() {
        this.active = false;
    } // CountDownTimer.pause()

    /**
     *
     */
    reset() {
        this.msec = this.msec0;
        return this.msec;
    } // CountDownTimer.reset()
    
    /**
     *
     */
    start() {
        this.reset();
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
class PlayerClock {
    /**
     *
     */
    constructor(delay_msec, limit_msec) {
        console.log(`PlayerClock(`
                    + `delay_msec=${delay_msec}, `
                    + `limit_msec=${limit_msec})`);

        this.delay_msec0 = delay_msec;
        this.limit_msec0 = limit_msec;
        this.delay_timer = new CountDownTimer(this.delay_msec0);
        this.limit_timer = new CountDownTimer(this.limit_msec0);
    } // PlayerClock.constructor()

    /**
     *
     */
    set(delay_msec, limit_msec) {
        this.delay_timer.set(delay_msec);
        this.limit_timer.set(limit_msec);
    } // PlayerClock.set()

    /**
     * update
     */
    update() {
        let delay_msec = this.delay_timer.update();
        let limit_msec = this.limit_timer.update();

        if ( delay_msec < 0 ) {
            limit_msec += delay_msec;
            delay_msec = 0;

            this.delay_timer.msec = delay_msec;
            this.limit_timer.msec = limit_msec;

            if ( this.delay_timer.active ) {
                this.delay_timer.pause();
                this.limit_timer.resume();
            }
        }

        console.log(`(${delay_msec}, ${limit_msec})`);
        return {"delay": delay_msec, "limit": limit_msec};
    } // PlayerClock.get()

    /**
     *
     */
    resume() {
        if ( this.delay_timer.msec > 0 ) {
            this.delay_timer.resume();
        } else {
            this.limit_timer.resume();
        }
    }

    /**
     *
     */
    pause() {
        this.delay_timer.pause();
        this.limit_timer.pause();
    }

    /**
     *
     */
    start() {
        this.update();
        this.pause();
        this.delay_timer.reset();
        this.resume();
    }

    /**
     *
     */
    str() {
        return `(${this.delay_timer.msec}, ${this.limit_timer.msec})`;
    }
} // class PlayerClock

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()>start`);

    // initialize Clock
    bg_clock = new BgClock("bg_clock", 5, 10);

    bg_clock.player_clock[0].set(12000, 12*60000);
    bg_clock.player_clock[1].set(12000, 12*60000);
}; // window.onload
