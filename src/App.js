import React, { Component } from 'react';
import Stat from './Stat';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state ={
            types:[],
            user: {},
            isLoaded: false,
            lastRecords: [],
            isAuth: false,
            token: this.getCookie('token'),
            showManage: false,
            showStat: false
        }

        console.log(this.state);

        this.nextApproach = this.nextApproach.bind(this);
        this.newType = this.newType.bind(this);
        this.nextTrain = this.nextTrain.bind(this);
        this.login = this.login.bind(this);
        this.newDay = this.newDay.bind(this);
        this.removeRecord = this.removeRecord.bind(this);
        this.logout = this.logout.bind(this);
        this.deleteType = this.deleteType.bind(this);
        this.renameType = this.renameType.bind(this);
        this.changeTypeForRecord = this.changeTypeForRecord.bind(this);
        this.changeRecordTrainNumber = this.changeRecordTrainNumber.bind(this);
        this.changeRecordApproachNumber = this.changeRecordApproachNumber.bind(this);
        this.changeWeight = this.changeWeight.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.toggleManage = this.toggleManage.bind(this);
        this.toggleStat = this.toggleStat.bind(this);

        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    logout() {
        document.cookie = "token=none";
        this.setState({
            isAuth: false,
            token: ''
        });
    }

    toggleManage() {
        this.setState({
            showManage: !this.state.showManage
        });
    }

    toggleStat() {
        this.setState({
            showStat: !this.state.showStat
        });
    }

    componentDidMount() {
        if (this.state.isAuth) {
            this.fetchTypes();
            this.fetchLastRecords();
        }
        this.fetchUser();
    }

    fetchTypes() {
        fetch(this.apiUrl + "traintypes",
            {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        types: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    login() {
        let that = this;

        let loginRequest = {
            name: document.getElementById("name").value,
            password: document.getElementById("password").value
        };
        console.log('loginRequest', loginRequest);
        fetch(that.apiUrl + 'register.json',               {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(loginRequest)
        }).then(res => res.json())
            .then(
                function(result) {
                    console.log('authorized', result);
                    that.setState({
                        isLoaded: true,
                        user: result,
                        isAuth: true,
                        token: result.token
                    });
                    document.cookie = "token=" + result.token;
                    document.getElementById("value").value = "";
                    document.getElementById("weight").value = "";
                    document.getElementById("value").focus();
                    that.fetchUser();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    fetchLastRecords() {
        fetch(this.apiUrl + "records?limit=25&page=1&sort=id&order=DESC",
            {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        lastRecords: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {

                }
            );
    }

    fetchUser() {
        fetch(this.apiUrl + "currentuser", {
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('user fetched', result);
                    if (result.code && result.code === 401) {
                        return;
                    }
                    this.setState({
                        isLoaded: true,
                        user: result,
                        isAuth: true
                    });
                    document.getElementById("value").value = "";
                    document.getElementById("weight").value = "";
                    document.getElementById("value").focus();
                    this.fetchTypes();
                    this.fetchLastRecords();
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                        isAuth: false,
                        token: null
                    });
                    document.cookie = "token=" + this.state.token;
                }
            )
    }

    newDay() {
        let that = this;

        fetch(that.apiUrl + 'users/' + this.state.user.id,               {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                currentTrain: 1,
                currentApproach: 1
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.setState({
                        isLoaded: true,
                        user: result
                    });
                    document.getElementById("value").value = "";
                    document.getElementById("weight").value = "";
                    document.getElementById("value").focus();
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    removeRecord(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'DELETE'
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    changeTypeForRecord(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                type: e.target.value
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    changeRecordTrainNumber(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                trainNumber: e.target.value
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    changeRecordApproachNumber(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                approachNumber: e.target.value
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    changeWeight(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                weight: e.target.value
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    changeValue(e) {
        let that = this;

        fetch(that.apiUrl + 'records/' + e.target.dataset.recordId,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                value: e.target.value
            })
        }).then(res => res.json())
            .then(
                function(result) {
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    nextTrain() {
        console.log('next train', this.state);
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(that.apiUrl + 'next-train',               {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        }).then(res => res.json())
            .then(
                function(result) {
                    that.setState({
                        isLoaded: true,
                        user: result
                    });
                    document.getElementById("value").value = "";
                    document.getElementById("weight").value = "";
                    document.getElementById("value").focus();
                    that.fetchLastRecords();
                },
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    nextApproach() {
        console.log('next approach', this.apiUrl);
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(this.apiUrl + 'records', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'POST',
            body: JSON.stringify({
                trainNumber: that.state.user.current_train,
                approachNumber: that.state.user.current_approach,
                value: parseFloat(document.getElementById("value").value),
                weight: parseFloat(document.getElementById("weight").value),
                type: parseInt(document.getElementById("type").value)
            })
        }).then(
            function(result) {
                fetch(that.apiUrl + 'next-approach',               {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + that.state.token
                    }
                }).then(res => res.json())
                    .then(
                        function(result) {
                            that.setState({
                                isLoaded: true,
                                user: result
                            });
                            document.getElementById("value").value = "";
                            document.getElementById("weight").value = "";
                            document.getElementById("value").focus();
                            that.fetchLastRecords();
                        },
                        (error) => {
                            that.setState({
                                isLoaded: true,
                                error
                            });
                        }
                    );
            },
            (error) => {
                that.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    newType() {
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(this.apiUrl + 'traintypes', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'POST',
            body: JSON.stringify({
                title: document.getElementById("train-title").value
            })
        }).then(
            function(result) {
                that.fetchTypes()
                document.getElementById('train-title').value = '';
            },
            (error) => {
                that.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    deleteType() {
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(this.apiUrl + 'traintypes/' + document.getElementById('type').value, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'DELETE'
        }).then(
            function(result) {
                that.fetchTypes();
                that.fetchLastRecords();
            },
            (error) => {
                that.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    renameType() {
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(this.apiUrl + 'traintypes/' + document.getElementById('type').value, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            method: 'PATCH',
            body: JSON.stringify({
                title: document.getElementById("train-title-rename").value
            })
        }).then(
            function(result) {
                that.fetchTypes();
                that.fetchLastRecords();
            },
            (error) => {
                that.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    render() {
        return (
          <div className="App">
            {
                  this.state.isAuth ?
                  <div>
                      <button onClick={this.logout}>logout</button>
                      <button onClick={this.toggleManage}>Manage</button>
                      <button onClick={this.toggleStat}>Statistics</button>
                      <br/>
                      <br/>
                      {
                          this.state.showManage ?
                          <div>
                              <input type="text" placeholder="new train type" id="train-title" name="train-title" autoComplete="off" />
                              <button onClick={this.newType}>OK</button>
                              <br/>
                          </div> :
                          null
                      }
                      {
                          ! this.state.showStat ?
                              <div>
                                  <select id="type">
                                      {
                                          this.state.types.map(item => <option value={item.id}>{item.title}</option>)
                                      }
                                  </select>
                                  {
                                      this.state.showManage ? <div>
                                          <input type="button" onClick={this.deleteType} value="Remove"/>
                                          <input type="text" id="train-title-rename" placeholder="train type title"/>
                                          <button onClick={this.renameType}>Rename</button>
                                      </div>:
                                          null
                                  }
                                  <br/>

                                  <p id="summary">Train {this.state.user.current_train}. Approach {this.state.user.current_approach}</p>

                                  <input type="number" id="weight" placeholder=""/>
                      <input type="number" id="value" placeholder=""/>
                      <input disabled={!this.state.isLoaded} type="button" id="next-approach" onClick={this.nextApproach} value="NEXT" />
                      <br/>
                      <input disabled={!this.state.isLoaded} id="next-train" onClick={this.nextTrain} type="button" value="NEW TRAIN" />
                      <input disabled={!this.state.isLoaded} id="new-day" onClick={this.newDay} type="button" value="NEW DAY" />
                          <table id="last-records">
                      <thead>
                      <tr>
                      <td className="App-date">Date</td>
                      <td>Type</td>
                      <td>Tr</td>
                      <td>Val</td>
                          {this.state.showManage ? <td>X</td> : null}
                      </tr>
                      </thead>
                      <tbody>
                  {
                      this.state.lastRecords.map(item => {
                      let jsTime = Date.parse(item.time);
                      let jsDate = new Date(jsTime);
                      console.log(jsTime, jsDate, jsDate.getFullYear());
                      return <tr>
                          <td><span className="App-date">{jsDate.toLocaleString()}</span></td>
                      <td>{
                              this.state.showManage ?
                                  <select className="train-type-record-select" onChange={this.changeTypeForRecord} data-record-id={item.id}>
                                      {
                                          this.state.types.map(typeItem => <option selected={item.type && typeItem.id === item.type.id} value={typeItem.id}>{typeItem.title}</option>)
                                      }
                                  </select> :
                              item.type ?
                              item.type.title :
                              null
                          }</td>
                      <td>
                          {
                              this.state.showManage ?
                                  <div>
                                      <input data-record-id={item.id} type="number" className="record-number" onChange={this.changeRecordTrainNumber} placeholder={item.train_number}/><input data-record-id={item.id} type="number"  className="record-number" onChange={this.changeRecordApproachNumber} placeholder={item.approach_number}/>
                                  </div>
                                   :
                                  <div>
                                      {item.train_number}/{item.approach_number}
                                  </div>
                          }
                          </td>
                      <td>
                          {
                              this.state.showManage ?
                                  <div>
                                      <input data-record-id={item.id} type="number" className="record-number" onChange={this.changeWeight} placeholder={item.weight}/><input data-record-id={item.id} type="number"  className="record-number" onChange={this.changeValue} placeholder={item.value}/>
                                  </div> :
                                  item.weight > 0 ?
                              item.weight + "/" + item.value : item.value
                          }
                      </td>
                              {
                                  this.state.showManage ? <td><a data-record-id={item.id} href="#" onClick={this.removeRecord}>X</a></td> : null
                              }
                      </tr>
                      })
                  }
                      </tbody>
                          </table>
                  </div> : null
                  }
                  </div>:
                  <div>
                      <input placeholder="login" name="name" id="name" type="text"/><input placeholder="password" name="password" id="password" type="password"/>
                    <button onClick={this.login}>OK</button>
                  </div>
              }
              {
                  this.state.isAuth && this.state.showStat ?
                  <Stat/> :
                  null
              }
          </div>
        );
      }
}

export default App;
