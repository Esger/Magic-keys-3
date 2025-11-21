export class App {
    attached() {
        if (this.isMobile()) {
            document.body.classList.add('mobile-view');
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
