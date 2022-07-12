import { customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import { html, PolymerElement } from '@polymer/polymer';
import '../components/about-block';
import '../components/hero-block';
import '../elements/pengurus-block';
import '../elements/gallery-block';
import '../elements/news-posts-block';
import '../elements/article-latest-block';
import '../elements/featured-videos';
import '../elements/map-block';
import '../elements/subscribe-block';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState } from '../store';
import { Viewport } from '../store/ui/types';
import { scrollToY } from '../utils/scrolling';
import { openDialog } from '../store/dialogs/actions';
import { DIALOGS } from '../store/dialogs/types';
@customElement('home-page')
export class HomePage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
          height: 100%;
        }

        .hero-logo {
          width: 100%;
          height: 100%;
        }

        .info-title {
          font-size: 28px;
          font-weight: 800;
        }

        .action-buttons {
          margin: 22px -8px;
        }

        .action-buttons paper-button {
          margin: 8px;
        }

        .action-buttons iron-icon {
          --iron-icon-fill-color: currentColor;
          margin-left: 14px;
        }

        .action-primary,
        .action-install {
          padding: 12px 22px;
        }

        .action-install {
          color: var(--text-primary-color) !important;
          border: 1px solid var(--text-primary-color) !important;
        }

        .scroll-down {
          margin-top: 24px;
          color: currentColor;
          user-select: none;
          cursor: pointer;
        }

        .scroll-down svg {
          width: 24px;
          opacity: 0.6;
        }

        .scroll-down .stroke {
          stroke: currentColor;
        }

        .scroll-down .scroller {
          fill: currentColor;
          animation: updown 2s infinite;
        }

        @keyframes updown {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(0, 5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @media (min-height: 500px) {
          hero-block {
            height: calc(100vh + 57px);
            max-height: calc(100vh + 1px);
          }

          .home-content {
            margin-top: -48px;
          }

          .scroll-down {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
          }
        }

        @media (min-width: 812px) {
          hero-block {
            height: calc(100vh + 65px);
          }

          .hero-logo {
            max-width: 320px;
          }

          .info-title {
            font-size: 32px;
          }
        }
      </style>

      <polymer-helmet active="[[active]]"></polymer-helmet>

      <hero-block
        id="hero"
        background-image="{$ heroSettings.home.background.image $}"
        background-color="{$ heroSettings.home.background.color $}"
        font-color="{$ heroSettings.home.fontColor $}"
        active="[[active]]"
        hide-logo
      >
        <div class="home-content" layout vertical start-justified>
          <div class="info-items">
            <div class="info-title">{$ heroSettings.home.title $}</div>
            <div class="info-description">{$ heroSettings.home.description $}</div>
          </div>

          <div class="action-buttons" layout horizontal wrap>
            <a href="/schedule/">
              <paper-button class="action-primary" primary invert>
                {$ enterIntoClass $}
                <iron-icon icon="lkim:chevron-right"></iron-icon>
              </paper-button>
            </a>
            <paper-button class="action-install" on-click="_openSignUpDialog" primary stroke>
              {$ downloadApp $}
              <iron-icon icon="icons:settings-cell"></iron-icon>
            </paper-button>
          </div></div
      ></hero-block>
    `;
  }

  @property({ type: Boolean })
  private active = false;
  @property({ type: Object })
  private viewport: Viewport;

  stateChanged(state: RootState) {
    this.viewport = state.ui.viewport;
  }

  _scrollNextBlock() {
    const heroHeight = this.$.hero.getBoundingClientRect().height - 55;
    scrollToY(heroHeight, 600, 'easeInOutSine');
  }

  _openSignUpDialog() {
    openDialog(DIALOGS.SIGNUP, { submitLabel: 'Buat Akun' });
  }
}
