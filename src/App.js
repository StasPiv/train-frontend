import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state ={
            types:[],
            user: {},
            isLoaded: false,
            lastRecords: [],
        }

        this.nextApproach = this.nextApproach.bind(this);
        this.nextTrain = this.nextTrain.bind(this);
        this.newDay = this.newDay.bind(this);
        this.removeRecord = this.removeRecord.bind(this);

        this.apiUrl = "http://api.train.pozitiffchess.net/";
    }

    componentDidMount() {
        fetch(this.apiUrl + "traintypes")
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
        this.fetchLastRecords();
        this.fetchUser();
    }

    fetchLastRecords() {
        fetch(this.apiUrl + "records?limit=25&page=1&sort=id&order=DESC")
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
        fetch(this.apiUrl + "users/1")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        user: result
                    });
                    document.getElementById("value").value = "";
                    document.getElementById("value").focus();
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
            )
    }

    newDay() {
        let that = this;

        fetch(that.apiUrl + 'users/1',               {
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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

    nextTrain() {
        console.log('next train');
        let that = this;
        that.setState({
            isLoaded: false
        });

        fetch(that.apiUrl + 'next-train',               {
            method: 'post'
        }).then(res => res.json())
            .then(
                function(result) {
                    that.setState({
                        isLoaded: true,
                        user: result
                    });
                    document.getElementById("value").value = "";
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
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                trainNumber: that.state.user.current_train,
                approachNumber: that.state.user.current_approach,
                value: parseFloat(document.getElementById("value").value),
                type: parseInt(document.getElementById("type").value)
            })
        }).then(
            function(result) {
                fetch(that.apiUrl + 'next-approach',               {
                    method: 'post'
                }).then(res => res.json())
                    .then(
                        function(result) {
                            that.setState({
                                isLoaded: true,
                                user: result
                            });
                            document.getElementById("value").value = "";
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

    render() {
        return (
          <div className="App">
            <select id="type">
                {
                    this.state.types.map(item => <option value={item.id}>{item.title}</option>)
                }
            </select>
              <br/>
              <p id="summary">Train {this.state.user.current_train}. Approach {this.state.user.current_approach}</p>
              <br/>
              <input type="number" id="value" placeholder=""/>
              <input disabled={!this.state.isLoaded} type="button" id="next-approach" onClick={this.nextApproach} value="NEXT" />
              <br/>
              <input disabled={!this.state.isLoaded} id="next-train" onClick={this.nextTrain} type="button" value="NEW TRAIN" />
              <input disabled={!this.state.isLoaded} id="new-day" onClick={this.newDay} type="button" value="NEW DAY" />
          <table id="last-records">
              <thead>
                <tr>
                    <td>Date</td>
                    <td>Type</td>
                    <td>Tr</td>
                    <td>Ap</td>
                    <td>Value</td>
                    <td>X</td>
                </tr>
              </thead>
              <tbody>
              {
                  this.state.lastRecords.map(item =>                    <tr>
                    <td>{item.time}</td>
                    <td>{item.type.title}</td>
                    <td>{item.train_number}</td>
                    <td>{item.approach_number}</td>
                    <td>{item.value}</td>
                    <td><a data-record-id={item.id} href="#" onClick={this.removeRecord}>X</a></td>
                  </tr>)
              }
              </tbody>
          </table>
          </div>
        );
      }
}

export default App;
