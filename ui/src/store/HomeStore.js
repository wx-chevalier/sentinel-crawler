import {observable, action} from 'mobx'

export default class HomeStore{
  @observable taskLists = [];

  @action getSpiderList(){
    fetch('/data/spider_list.json')
    .then(function(res){
      return res.json()
    })
    .then(data => {
      this.taskLists = data
    })
    .catch(function(error){
      console.log(error)
    })
  }
}