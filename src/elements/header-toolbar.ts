import { customElement, observe, property } from '@polymer/decorators';
import { PaperMenuButton } from '@polymer/paper-menu-button';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import { closeDialog } from '../store/dialogs/actions';
import { initialDialogState } from '../store/dialogs/state';
import { DIALOGS } from '../store/dialogs/types';
import { requestPermission, unsubscribe } from '../store/notifications/actions';
import { NOTIFICATIONS_STATUS } from '../store/notifications/types';
import { initialRoutingState, RoutingState } from '../store/routing/state';
import { TempAny } from '../temp-any';
import { isDialogOpen } from '../utils/dialogs';
import './shared-styles';

@customElement('header-toolbar')
export class HeaderToolbar extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          --iron-icon-fill-color: currentColor;
          display: block;
          z-index: 1;
          background-color: var(--primary-background-color);
          transition: background-color var(--animation), border-bottom-color var(--animation),
            color var(--animation);
          color: var(--default-primary-color);
          box-shadow: var(--box-shadow-header);
        }

        app-toolbar {
          margin: 0 auto;
          padding: 0 16px;
          height: auto;
          max-width: var(--max-container-width);
        }

        .dropdown-panel {
          padding: 24px;
          max-width: 300px;
          background: #fff;
          font-size: 16px;
          color: var(--primary-text-color);
        }

        .dropdown-panel p {
          margin-top: 0;
        }

        .dropdown-panel .panel-actions {
          margin: 0 -16px -16px 0;
        }

        paper-button iron-icon {
          margin-right: 8px;
          --iron-icon-fill-color: var(--hero-font-color);
        }

        @media (min-width: 640px) {
          app-toolbar {
            padding: 0 24px;
            height: initial;
          }
        }
      </style>

      <app-toolbar class="header">
        <div layout horizontal center flex>
          <paper-icon-button
            icon="lkim:menu"
            aria-label="menu"
            on-click="openDrawer"
          ></paper-icon-button>
        </div>

        <paper-menu-button
          id="notificationsMenu"
          class="notifications-menu"
          vertical-align="top"
          horizontal-align="right"
          no-animations
        >
          <paper-icon-button
            icon="lkim:[[_getNotificationsIcon(notifications.status)]]"
            slot="dropdown-trigger"
          ></paper-icon-button>
          <div class="dropdown-panel" slot="dropdown-content">
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'DEFAULT')]]">
              <p>{$ notifications.default $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <paper-button primary-text on-click="_toggleNotifications"
                  >{$ notifications.subscribe $}</paper-button
                >
              </div>
            </div>
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'GRANTED')]]">
              <p>{$ notifications.enabled $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <paper-button primary-text on-click="_toggleNotifications"
                  >{$ notifications.unsubscribe $}</paper-button
                >
              </div>
            </div>
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'DENIED')]]">
              <p>{$ notifications.blocked $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <a href="{$ notifications.enable.link $}" target="_blank" rel="noopener noreferrer">
                  <paper-button primary-text on-click="_closeNotificationMenu"
                    >{$ notifications.enable.label $}
                  </paper-button>
                </a>
              </div>
            </div>
          </div>
        </paper-menu-button>
      </app-toolbar>
    `;
  }

  @property({ type: Object })
  route: RoutingState = initialRoutingState;
  @property({ type: Boolean, notify: true })
  drawerOpened: boolean;
  @property({ type: Object })
  private viewport = {};
  @property({ type: Object })
  private heroSettings = {};
  @property({ type: Object })
  private dialogs = initialDialogState;
  @property({ type: Object })
  private notifications: { token?: string; status?: string } = {};
  @property({ type: Object })
  private credential: { signedIn?: boolean } = {};
  @property({ type: Boolean, reflectToAttribute: true })
  private transparent = false;

  stateChanged(state: RootState) {
    this.dialogs = state.dialogs;
    this.notifications = state.notifications;
    this.route = state.routing;
    this.credential = state.credential;
    this.heroSettings = state.ui.heroSettings;
    this.viewport = state.ui.viewport;
  }

  connectedCallback() {
    super.connectedCallback();
    (window as TempAny).FIKIH8MTSBONTOUSE.Elements.HeaderToolbar = this;
    this._onScroll = this._onScroll.bind(this);
    window.addEventListener('scroll', this._onScroll);
    this._onScroll();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
  }

  openDrawer() {
    this.drawerOpened = true;
  }

  _onScroll() {
    this.transparent = document.documentElement.scrollTop === 0;
  }

  @observe('credential.signedIn')
  _authStatusChanged(_signedIn) {
    if (isDialogOpen(this.dialogs, DIALOGS.SIGNIN)) {
      closeDialog();
    }
  }

  _toggleNotifications() {
    this._closeNotificationMenu();
    if (this.notifications.status === NOTIFICATIONS_STATUS.GRANTED) {
      store.dispatch(unsubscribe(this.notifications.token));
      return;
    }
    store.dispatch(requestPermission());
  }

  _getNotificationsIcon(status) {
    return status === NOTIFICATIONS_STATUS.DEFAULT
      ? 'bell-outline'
      : status === NOTIFICATIONS_STATUS.GRANTED
      ? 'bell'
      : 'bell-off';
  }

  _hideNotificationBlock(status, blockStatus) {
    return status !== NOTIFICATIONS_STATUS[blockStatus];
  }

  _closeNotificationMenu() {
    // TODO: Remove type cast
    (this.$.notificationsMenu as PaperMenuButton).close();
  }

  @observe('heroSettings')
  _setToolbarSettings(settings) {
    if (!settings) return;
    this.updateStyles({
      '--hero-font-color': settings.fontColor || '',
      '--hero-logo-opacity': settings.hideLogo ? '0' : '1',
      '--hero-logo-color': settings.backgroundImage ? '#fff' : 'var(--default-primary-color)',
    });
  }
}
