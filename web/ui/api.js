export
function apiCall(endPoint, params=null, method='POST') {
  const body = params ? JSON.stringify(params) : null
  console.log(`${method} ${endPoint} ${body}`);
  return fetch(endPoint, {
    method, body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) =>{
    return response.json();
  }).catch((error) => {
    console.error(error);
  });
}

export
const DEFAULT_SEARCH = {orQ: 'and', count: false, from:0, size:20, minPrice:0, maxPrice: 0, sortBy:'time', sortOrder: 'desc'};

export
function search(query) {
  const params = Object.assign({}, DEFAULT_SEARCH, query);
  return apiCall(`/search`, params).then(response => {
    if(query.count){
      return response;
    }
    if(response.hits && response.hits.hits) {
      response.hits.hitSources = response.hits.hits.map((v) => v._source);
      return response.hits;
    }
    console.error('No hits received, response:', response);
    return {hitSources:[]};
  })
}


export
function getTotalAdCount() {
  return search({q: '*', count: true, size:0});
}
