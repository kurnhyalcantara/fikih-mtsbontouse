import { Failure, Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/paper-input/paper-input';
import { PaperInputElement } from '@polymer/paper-input/paper-input';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import { subscribe } from '../store/subscribe/actions';
import { initialSubscribeState, SubscribeState } from '../store/subscribe/state';
import './lkim-icons';
import './shared-styles';

@customElement('subscribe-form-footer')
export class SubscribeFormFooter extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          --paper-input-container-color: var(--footer-text-color);
          --paper-input-container-focus-color: var(--default-primary-color);
          --paper-input-container-input-color: var(--footer-text-color);
        }

        paper-input {
          padding-bottom: 0;
        }

        paper-input,
        .form-content {
          width: 100%;
        }

        paper-input-container input,
        paper-input-container label {
          font-size: 14px;
        }

        iron-icon {
          margin-bottom: 5px;
        }

        paper-button {
          margin-top: 8px;
          color: var(--secondary-text-color);
        }

        paper-button:hover {
          cursor: pointer;
        }

        paper-button[disabled] {
          background: none;
          padding-right: 0;
        }
      </style>

      <div class="form-content" layout vertical center>
        <paper-input
          id="emailInput"
          label="{$ subscribeBlock.yourEmail $}"
          value="{{email}}"
          required
          auto-validate$="[[validate]]"
          error-message="{$ subscribeBlock.emailRequired $}"
          autocomplete="off"
          disabled="[[subscribed.data]]"
        >
          <iron-icon icon="lkim:checked" slot="suffix" hidden$="[[!subscribed.data]]"></iron-icon>
        </paper-input>
        <paper-button on-click="_subscribe" ga-on="click" disabled="[[disabled]]" layout self-end>
          [[ctaLabel]]
        </paper-button>
      </div>
    `;
  }

  @property({ type: Object })
  subscribed: SubscribeState = initialSubscribeState;
  @property({ type: String })
  email = '';
  @property({ type: String })
  pass = '';
  @property({ type: Boolean })
  private validate = false;

  stateChanged(state: RootState) {
    this.subscribed = state.subscribed;
  }

  _subscribe() {
    this.validate = true;
    const emailInput = this.shadowRoot.querySelector<PaperInputElement>('#emailInput');

    if ((this.initialized || this.failure) && emailInput.validate()) {
      store.dispatch(subscribe({ email: this.email, pass: this.pass }));
    }
  }

  @computed('subscribed')
  get ctaLabel() {
    return this.subscribed instanceof Success
      ? '{$  subscribeBlock.subscribed $}'
      : '{$  subscribeBlock.subscribe $}';
  }

  @computed('email', 'subscribed')
  get disabled() {
    return !this.email || this.subscribed instanceof Success;
  }

  @computed('subscribed')
  get failure() {
    return this.subscribed instanceof Failure;
  }

  @computed('subscribed')
  get initialized() {
    return this.subscribed instanceof Initialized;
  }
}
