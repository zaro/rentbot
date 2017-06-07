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
function search(q, sortBy, sortOrder, from=0, size=10) {
  const params = {q, orQ: 'and', sortBy, sortOrder, count: false, size, from};
  return apiCall(`/search`, params).then(response => {
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
  return apiCall('/search', {q: '*', orQ: 'and', sortBy:'time', sortOrder: 'asc', count: true, from:0, size:0});
}
