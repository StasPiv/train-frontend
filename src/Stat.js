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

        this.apiUrl = process.env.REACT_APP_API_URL;
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
        if (!this.state.token || !this.state.stat['last']) {
            return null;
        }

        return <div className="records">
            <h2 className="records-title">Рекорды</h2><table>
            <thead>
            <tr>
                <th width={30}>Упражнение</th>
                <th>Повторения<br/>(макс/мин/ср)</th>
                <th>Вес<br/>(макс/мин/ср)</th>
            </tr>
            </thead><tbody>{
            this.state.stat['records'].map(item => <tr>
                    <td>{item.title}</td>
                    <td>{item.maxValue}/{item.minValue}/{item.avgValue}</td>
                    <td>{item.maxWeight}/{item.minWeight}/{item.avgWeight}</td>
                </tr>
            )
        }</tbody>
        </table>
            <h2 className="records-title">Последние записи</h2><table>
            <thead>
                <tr>
                    <th width={30}>Упражнение</th>
                    <th>Дней назад</th>
                    <th>Повторения<br/>(макс/мин/ср)</th>
                    <th>Вес<br/>(макс/мин/ср)</th>
                </tr>
            </thead><tbody>{
                this.state.stat['last'].map(item => <tr>
                            <td>{item.title}</td>
                            <td>{item.interv}</td>
                            <td>{item.maxValue}/{item.minValue}/{item.avgValue}</td>
                            <td>{item.maxWeight}/{item.minWeight}/{item.avgWeight}</td>
                    </tr>
                )
        }</tbody>
            </table>
        </div>
    }
}