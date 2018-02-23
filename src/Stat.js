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
            }
        };

        this.apiUrl = "http://127.0.0.1:8000/";
    }

    componentDidMount() {
        let that = this;
        fetch(this.apiUrl + "allstat")
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
        return <div className="records">
            <span className="records-title">Сегодня</span>: {
                this.state.stat['today'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее</span>: {item.avg}
                        </div>
                        <div>
                            <span className="type-title">{item.title} максимальное</span>: {item.max}
                        </div>
                    </div>
                )
            }
            <span className="records-title">Вчера</span>: {
                this.state.stat['yesterday'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее</span>: {item.avg}
                        </div>
                        <div>
                            <span className="type-title">{item.title} максимальное</span>: {item.max}
                        </div>
                    </div>
                )
            }
            <span className="records-title">7 дней</span>: {
                this.state.stat['7days'].map(item => <div>
                    <div>
                        <span className="type-title">{item.title} среднее</span>: {item.avg}
                    </div>
                    <div>
                        <span className="type-title">{item.title} максимальное</span>: {item.max}
                    </div>
                </div>
                )
            }
            <span className="records-title">30 дней</span>: {
                this.state.stat['30days'].map(item => <div>
                        <div>
                            <span className="type-title">{item.title} среднее</span>: {item.avg}
                        </div>
                        <div>
                            <span className="type-title">{item.title} максимальное</span>: {item.max}
                        </div>
                    </div>
                )
            }
        </div>
    }
}