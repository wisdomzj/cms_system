const ARTICLE_API = {
  articleFindAll: {
    method: 'get',
    url: '/article/findAll'
  },
  addArticle: {
    method: 'post',
    url: '/article/add'
  },
  removeArticle: {
    method: 'post',
    url: '/article/remove'
  },
  showArticle: {
    method: 'get',
    url: '/article/findById'
  },
  editArticle: {
    method: 'post',
    url: '/article/edit'
  }
}

export default ARTICLE_API

