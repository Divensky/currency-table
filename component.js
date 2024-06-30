import { getData, getRate } from './apiService';
import { formatNumber } from './utils';

const data = await getData();
const rate = await getRate();

const currencyData = Object.entries(data.data).map(([key, value]) => ({
  name: value.name,
  iso: value.iso,
  price: value.ohlc.c,
  change: value.change.value,
}));

export class CurrencyTable extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const currency = this.getAttribute('currency');

    const style = document.createElement('style');
    style.textContent = `
      table {
        border-collapse: collapse;
        border: 1px solid black;
        margin: 16px 0;
      }
      th {
        background-color: #ccc;        
      }
      th, td {
        padding: 8px;
        text-align: left;
        border: 1px solid black;
      }
    `;
    shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.textContent = 'According to Coindesk';
    const template = document.createElement('template');
    template.innerHTML = `
      <table>
      <thead>
          <tr>
            <th>Asset</th>
            <th>Name</th>
            <th>USD</th>
            <th>EURO</th>
            <th>GBP</th>
            <th>Holdings</th>
            <th>Value on hand</th>
          </tr>
        </thead>
        <tbody id="body">
        </tbody>
      </table>
    `;

    const templateContent = template.content.cloneNode(true);
    const tbody = templateContent.querySelector('#body');

    const rowTemplate = document.createElement('template');
    rowTemplate.innerHTML = `
      <tr>
        <td id="iso"></td>
        <td id="name"></td>
        <td id="price"></td>
        <td id="euro"></td>
        <td id="gbp"></td>
        <td>
          <input id="input" placeholder="Enter amount..." type="number"/>
        </td>
        <td id="product"></td>
      </tr>
    `;

    for (let i = 0; i < currencyData.length - 24; i++) {
      const item = currencyData[i];
      const rowContent = rowTemplate.content.cloneNode(true);
      const isoCell = rowContent.querySelector('#iso');
      const nameCell = rowContent.querySelector('#name');
      const priceCell = rowContent.querySelector('#price');
      priceCell.style.color = 'green';

      isoCell.textContent = item.iso;
      nameCell.textContent = item.name;
      priceCell.textContent = formatNumber(item.price.toFixed(2));

      if (item.change < 0) {
        priceCell.style.color = 'red';
      }

      const euroCell = rowContent.querySelector('#euro');
      euroCell.textContent = formatNumber(
        item.price.toFixed(2) * rate.rates.EUR,
        'Eur'
      );
      const gpbCell = rowContent.querySelector('#gbp');
      gpbCell.textContent = formatNumber(
        item.price.toFixed(2) * rate.rates.GBP,
        'Gbp'
      );

      const input = rowContent.querySelector('#input');
      const product = rowContent.querySelector('#product');
      input.addEventListener('change', (ev) => {
        // todo: error handling
        product.textContent = formatNumber(
          item.price * ev.target.value * rate.rates[currency.toUpperCase()],
          currency
        );
      });
      tbody.appendChild(rowContent);
    }

    wrapper.appendChild(templateContent);
    shadow.appendChild(wrapper);
  }
}

window.customElements.define('currency-table', CurrencyTable);
