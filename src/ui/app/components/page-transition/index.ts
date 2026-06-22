import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';

const DEFAULT_TRANSITION = 'fade';
const DEFAULT_TRANSITION_MODE = 'out-in';

@Component({
    name: 'page-transition',
    template: require('./index.html')
})
export class PageTransition extends Vue {
    private prevHeight = 0;
    private transitionName = DEFAULT_TRANSITION;
    private transitionMode = DEFAULT_TRANSITION_MODE;
    private transitionEnterActiveClass = '';

    created() {
        this.$router.beforeEach((to, from, next) => {
            let transitionName = to.meta.transitionName || from.meta.transitionName || DEFAULT_TRANSITION;

            if (transitionName === 'slide') {
                const toDepth = to.path.split('/').length;
                const fromDepth = from.path.split('/').length;
                transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
            }

            this.transitionMode = DEFAULT_TRANSITION_MODE;
            this.transitionEnterActiveClass = `${transitionName}-enter-active`;

            if (to.meta.transitionName === 'zoom') {
                this.transitionMode = 'in-out';
                this.transitionEnterActiveClass = 'zoom-enter-active';
                document.body.style.overflow = 'hidden';
            }

            if (from.meta.transitionName === 'zoom') {
                this.transitionMode = null;
                this.transitionEnterActiveClass = null;
                document.body.style.overflow = null;
            }

            this.transitionName = transitionName;

            next();
        });
    }

    beforeLeave(element) {
        this.prevHeight = Number(getComputedStyle(element).height);
    }
    enter(element) {
        const { height } = getComputedStyle(element);

        element.style.height = this.prevHeight;

        setTimeout(() => {
            element.style.height = height;
        });
    }
    afterEnter(element) {
        element.style.height = 'auto';
    }
}