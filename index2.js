function HttpClient(baseUrl) {
    this.baseUrl = baseUrl;

    const fetchWrapper = (promise) => {
      return new Promise(async (resolve) => {
        try {
          const response = await promise;
  
          if (response.ok) {
            const json = await response.json();
            resolve({ response: json, error: null });
            return;
          }
  
          resolve({ response: null, error: response });
        } catch (error) {
          resolve({ response: null, error });
        }
      });
    };
  
    return {
      get: (path) => {
        return fetchWrapper(fetch(`${this.baseUrl}/${path}`));
      } ,

      post: (path , body) => {
        return fetchWrapper(
            fetch({
            url : `${this.baseUrl}/${path}` ,
            method : 'POST' ,
            body: JSON.stringify(body),
            headers: {'Content-type': 'application/json; charset=UTF-8',}
                    })
        )
    } ,
      
      delite : (path) => {
        return fetchWrapper(
            fetch({
            url : `${this.baseUrl}/${path}` ,
            method : 'DELITE' 
                    })
        )
    } ,

    
      update: (path , body) => {
        return fetchWrapper(
            fetch({
            url : `${this.baseUrl}/${path}` ,
            method : 'PATCH' ,
            body: JSON.stringify(body),
            headers: {'Content-type': 'application/json; charset=UTF-8',}
                    })
        )
    }




    };
  }



/* 
  
  const api = new HttpClient("https://jsonplaceholder.typicode.com");
  
  const examples = async () => {
    const { response, error } = await api.get("posts");
    //Если запрос успешный то в поле response должен быть ответ, если нет то null
    //Если получили какую-то ошибку в апи, то она должна быть в поле error, иначе там должен быть null
  
    // const { response, error } = await api.post("posts", {
    //   title: 'foo',
    //   body: 'bar',
    //   userId: 1,
    //  });
  
    // /////////////////////////////////////////////////////////////////////////////
    // const { response, error } = await api.put(`posts/${id}`, {
    //   title: 'foo',
    //   body: 'bar',
    //   userId: 1,
    // });
  
    // /////////////////////////////////////////////////////////////////////////////
    // const { response, error } = await api.delete(`posts/${id}`);
  
    // /////////////////////////////////////////////////////////////////////////////
    // const { response, error } = await api.patch(`posts/${id}`, {
    //   title: 'foo'
    // });
  
    console.log({ response, error });
  };
  
  examples();
   */ 