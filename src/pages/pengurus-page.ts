import { Success } from '@abraham/remotedata';
import '@polymer/app-route/app-route';
import { customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/iron-location/iron-location';
import '@polymer/paper-icon-button';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/content-loader';
import '../elements/filter-menu';
import '../elements/shared-styles';
import '../elements/text-truncate';
import { ReduxMixin } from '../mixins/redux-mixin';
import { PengurusHoC } from '../mixins/pengurus-hoc';
import { RootState } from '../store';
import { closeDialog, openDialog } from '../store/dialogs/actions';
import { DIALOGS } from '../store/dialogs/types';
import { PengurusState } from '../store/pengurus/state';
import { isDialogOpen } from '../utils/dialogs';
import { generateClassName, parseQueryParamsFilters } from '../utils/functions';

@customElement('pengurus-page')
export class PengurusPage extends PengurusHoC(ReduxMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
          height: 100%;
        }

        .container {
          display: grid;
          padding: 24px 24px;'
          grid-template-columns: 1fr;
          grid-gap: 16px;
          min-height: 80%;
        }

        .pengurus {
          padding: 32px 24px;
          background: var(--primary-background-color);
          text-align: center;
          transition: box-shadow var(--animation);
        }

        .pengurus:hover {
          box-shadow: var(--box-shadow);
        }

        .photo {
          width: 128px;
          height: 128px;
          background-color: var(--secondary-background-color);
          border-radius: 50%;
          overflow: hidden;
          transform: translateZ(0);
        }

        .description {
          color: var(--primary-text-color);
        }

        .name {
          margin-top: 8px;
          line-height: 1;
        }

        .jabatan {
          margin-top: 4px;
          font-size: 14px;
          line-height: 1.1;
        }

        .bio {
          margin-top: 16px;
          color: var(--secondary-text-color);
        }

        .contacts {
          margin-top: 16px;
        }

        .social-icon {
          --paper-icon-button: {
            padding: 6px;
            width: 32px;
            height: 32px;
          }
          color: var(--secondary-text-color);
        }

        paper-progress {
          width: 100%;
          --paper-progress-active-color: var(--default-primary-color);
          --paper-progress-secondary-color: var(--default-primary-color);
        }

        @media (min-width: 640px) {
          .container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 812px) {
          .container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .container {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      </style>

      <polymer-helmet
        title="{$ heroSettings.pengurus.title $} | {$ title $}"
        description="{$ heroSettings.pengurus.metaDescription $}"
        active="[[_setHelmetData(active, isPengurusDialogOpened, isSessionDialogOpened)]]"
      ></polymer-helmet>

      <iron-location query="{{queryParams}}"></iron-location>

      <app-route route="[[route]]" pattern="/:pengurusId" data="{{routeData}}"></app-route>

      <hero-block
        background-image="{$ heroSettings.pengurus.background.image $}"
        background-color="{$ heroSettings.pengurus.background.color $}"
        font-color="{$ heroSettings.pengurus.fontColor $}"
        active="[[active]]"
      >
        <div class="hero-title">{$ heroSettings.pengurus.title $}</div>
        <p class="hero-description">{$ heroSettings.pengurus.description $}</p>
      </hero-block>

      <paper-progress indeterminate hidden$="[[contentLoaderVisibility]]"></paper-progress>
      <content-loader
        class="container"
        card-padding="32px"
        card-height="400px"
        avatar-size="128px"
        avatar-circle="64px"
        horizontal-position="50%"
        border-radius="4px"
        box-shadow="var(--box-shadow)"
        items-count="{$ contentLoaders.pengurus.itemsCount $}"
        hidden$="[[contentLoaderVisibility]]"
      ></content-loader>

      <div class="container">
        <template is="dom-repeat" items="[[pengurusToRender]]" as="pengurus">
          <a class="pengurus card" href$="[[pengurus.link]]">
            <div relative>
              <plastic-image
                class="photo"
                srcset="[[pengurus.photoUrl]]"
                sizing="cover"
                lazy-load
                preload
                fade
              ></plastic-image>
            </div>

            <div class="description">
              <h2 class="name">[[pengurus.name]]</h2>
              <div class="jabatan">[[pengurus.jabatan]]</div>

              <text-truncate lines="5">
                <div class="bio">[[pengurus.bio]]</div>
              </text-truncate>
            </div>

            <div class="contacts">
              <template is="dom-repeat" items="[[pengurus.socials]]" as="social">
                <a href$="[[social.link]]" target="_blank" rel="noopener noreferrer">
                  <paper-icon-button
                    class="social-icon"
                    icon="lkim:{{social.icon}}"
                  ></paper-icon-button>
                </a>
              </template>
            </div>
          </a>
        </template>
      </div>

      <footer-block></footer-block>
    `;
  }

  @property({ type: Object })
  private route = {};
  @property({ type: Object })
  private routeData = {};
  @property({ type: Boolean })
  private active = false;
  @property({ type: Object })
  private queryParams = {};
  @property({ type: Boolean })
  private isPengurusDialogOpened = false;
  @property({ type: Boolean })
  private isSessionDialogOpened = false;
  @property({ type: String })
  private contentLoaderVisibility;
  @property({ type: Object })
  private _selectedFilters;
  @property({ type: Array })
  private pengurusToRender = [];

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.isPengurusDialogOpened = isDialogOpen(state.dialogs, DIALOGS.PENGURUS);
    this.isSessionDialogOpened = isDialogOpen(state.dialogs, DIALOGS.SESSION);
  }

  @observe('pengurus')
  _pengurusChanged(pengurus: PengurusState, selectedFilters) {
    if (pengurus instanceof Success) {
      this.contentLoaderVisibility = 'hidden';
      const filters = selectedFilters && selectedFilters.tag ? selectedFilters.tag : [];
      const updatedPengurus = this._filterItems(pengurus.data, filters).map((pengurus) =>
        Object.assign({}, pengurus, {
          link: `/pengurus/${pengurus.id}${this.queryParams ? `?${this.queryParams}` : ''}`,
        })
      );
      this.pengurusToRender = updatedPengurus;
    }
  }

  @observe('active', 'pengurus', 'routeData.pengurusId')
  _openSpeakerDetails(active, pengurus: PengurusState, id: string) {
    if (pengurus instanceof Success) {
      requestAnimationFrame(() => {
        if (active && id) {
          const pengurusData = pengurus.data.find((pengurus) => pengurus.id === id);
          pengurusData && openDialog(DIALOGS.PENGURUS, pengurusData);
        } else {
          this.isPengurusDialogOpened && closeDialog();
          this.isSessionDialogOpened && closeDialog();
        }
      });
    }
  }

  _setHelmetData(active, isPengurusDialogOpened, isSessionDialogOpened) {
    return active && !isPengurusDialogOpened && !isSessionDialogOpened;
  }

  @observe('queryParams')
  _paramsUpdated(queryParams) {
    this._selectedFilters = parseQueryParamsFilters(queryParams);
  }

  _filterItems(pengurus, selectedFilters) {
    return pengurus.filter((pengurus) => {
      if (!selectedFilters || !selectedFilters.length) return true;
      return (
        pengurus.tags &&
        !!pengurus.tags.filter((tag) => selectedFilters.includes(generateClassName(tag))).length
      );
    });
  }
}
