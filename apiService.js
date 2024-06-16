// https://production.api.coindesk.com/v2/tb/price/ticker?assets=all
// https://api.exchangerate-api.com/v4/latest/USD

export async function getData() {
    const response = await fetchData(
      'https://production.api.coindesk.com/v2/tb/price/ticker?assets=all'
    );
  
    return response;
  }
  
  export async function getRate() {
    const response = await fetchData(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );
    return response;
  }
  
  export async function fetchData(url) {
    const response = await fetch(url);
    console.log('response', response);
    if (!response.ok) {
      throw new Error('No API response');
    }
    return response.json();
  }
  