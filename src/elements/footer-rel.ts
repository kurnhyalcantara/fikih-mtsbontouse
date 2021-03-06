import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import './subscribe-form-footer';

@customElement('footer-rel')
export class FooterRel extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          border-top: 1px solid var(--border-light-color);
          border-bottom: 1px solid var(--border-light-color);
          margin: 0 20px 0 20px;
          overflow: auto;
          overflow-y: hidden;
          padding: 10px 0;
          color: var(--footer-text-color);
          display: grid;
          grid-gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .col-heading {
          font-size: 14px;
          font-weight: 600;
          line-height: 21px;
          margin-top: 25px;
          margin-bottom: 10px;
        }

        .nav {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        a {
          color: var(--footer-text-color);
          padding-bottom: 2px;
          text-decoration: none;
          pointer-events: all;
        }

        li {
          display: list-item;
          line-height: 25px;
          pointer-events: none;
        }

        li:hover {
          text-decoration: underline;
        }

        @media (min-width: 768px) {
          :host {
            margin: 15px 0;
            padding: 30px 0;
          }

          .col-heading {
            font-size: 18px;
            margin-top: 0;
          }
        }
      </style>
      {% for footerRel in footerRelBlock %}
      <div class="col" layout vertical wrap flex-auto>
        <div class="col-heading">{$ footerRel.title $}</div>
        <ul class="nav">
          {% for link in footerRel.links %}
          <li>
            <a
              href="{$ link.url $}"
              {%
              if
              link.newtab
              %}
              target="_blank"
              rel="noopener noreferrer"
              {%
              endif
              %}
              >{$ link.name $}</a
            >
          </li>
          {% endfor %}
        </ul>
      </div>
      {% endfor %}

      <div class="col" layout vertical flex-auto wrap>
        <div class="col-heading">{$ subscribe $}</div>
        <span>{$ subscribeNote $}</span>
        <subscribe-form-footer></subscribe-form-footer>
      </div>
    `;
  }
}
