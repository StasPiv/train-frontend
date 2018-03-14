/**
 * Created by ssp on 23.02.18.
 */
import React, { Component } from 'react';

export default class Stat extends Component {
    constructor(props) {
        super(props);
        this.state ={
            stat:{
                "30days": [],
                "7days": [],
                "yesterday": [],
                "today": []
            },
            token: this.getCookie('token')
        };

        // this.apiUrl = "http://api.train.pozitiffchess.net/";
        this.apiUrl = "http://127.0.0.1:8000/";
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    componentDidMount() {
        let that = this;
        fetch(this.apiUrl + "allstat", {
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result['30days']);
                    that.setState({
                        isLoaded: true,
                        stat: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    that.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    render() {
        if (!this.state.token || !this.state.stat['today']) {
            return null;
        }

        return <div className="records">
            <span className="records-title">Сегодня</span>: {
                this.state.stat['today'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее к-во: {item.avg}</span><span className="type-title">{item.title} средний вес: {item.avgWeight}</span>
                        </div>
                        <div>
                            <span className="type-title">{item.title} макс. к-во: {item.max}</span><span className="type-title">{item.title} макс. вес: {item.maxWeight}</span>
                        </div>
                    </div>
                )
            }
            <span className="records-title">Вчера</span>: {
                this.state.stat['yesterday'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее к-во: {item.avg}</span><span className="type-title">{item.title} средний вес: {item.avgWeight}</span>
                        </div>
                        <div>
                            <span className="type-title">{item.title} макс. к-во: {item.max}</span><span className="type-title">{item.title} макс. вес: {item.maxWeight}</span>
                        </div>
                    </div>
                )
            }
            <span className="records-title">7 дней</span>: {
                this.state.stat['7days'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее к-во: {item.avg}</span><span className="type-title">{item.title} средний вес: {item.avgWeight}</span>
                        </div>
                        <div>
                            <span className="type-title">{item.title} макс. к-во: {item.max}</span><span className="type-title">{item.title} макс. вес: {item.maxWeight}</span>
                        </div>
                    </div>
                )
            }
            <span className="records-title">30 дней</span>: {
                this.state.stat['30days'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее к-во: {item.avg}</span><span className="type-title">{item.title} средний вес: {item.avgWeight}</span>
                        </div>
                        <div>
                            <span className="type-title">{item.title} макс. к-во: {item.max}</span><span className="type-title">{item.title} макс. вес: {item.maxWeight}</span>
                        </div>
                    </div>
                )
            }
        </div>
    }
}