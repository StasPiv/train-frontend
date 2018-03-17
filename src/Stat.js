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
                "today": [],
                "isLoaded": false
            },
            records: [],
            token: this.getCookie('token')
        };

        this.apiUrl = process.env.REACT_APP_API_URL;

        this.filterRecordsByType = this.filterRecordsByType.bind(this);

        this.fetchByType();
    }

    fetchByType(type) {
        let searchString = this.apiUrl + "records?limit=100&page=1&sort=id&order=DESC";

        if (type && type != 0) {
            searchString += "&type=" + type;
        }

        fetch(searchString,
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
                        records: result.items
                    });

                    console.log(result.items);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {

                }
            );
    }

    filterRecordsByType(event) {
        this.fetchByType(event.target.value);
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

        console.log('types', this.props.types);

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
            <h2 className="records-title">Последние записи</h2>
            <select className="train-type-stat-filter" onChange={this.filterRecordsByType}>
                <option value={0}>Выберите упражнение</option>
                {
                    this.props.types.map(typeItem => <option value={typeItem.id}>{typeItem.title}</option>)
                }
            </select>
            <table className="last-records">
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Упражнение</th>
                    <th>#</th>
                    <th>Результат</th>
                </tr>
            </thead><tbody>{
                this.state.records.length > 0 ?
                this.state.records.map(item => {
                    let jsTime = Date.parse(item.time);
                    let jsDate = new Date(jsTime);
                    return <tr>
                        <td><span className="App-date">{jsDate.toLocaleString()}</span></td>
                        <td>{item.type.title}</td>
                        <td>{item.train_number}/{item.approach_number}</td>
                        <td>
                            {item.weight > 0 ?
                                        item.weight + "/" + item.value : item.value
                            }
                        </td>
                    </tr>
                }) : null
            }</tbody>
            </table>
        </div>
    }
}