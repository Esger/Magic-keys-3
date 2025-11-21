export class App {

    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
    attached() {
        if (this.isMobile) {
            document.body.classList.add('mobile-view');
        }
    }
}
