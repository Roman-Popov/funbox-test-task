import React, { Component } from 'react';
import './App.css';

import NodeList from './components/NodeList';

class App extends Component {

    state = {
        nodes: [],
        draggedItem: null,
        markedItem: null
    }


    componentDidMount() {
        const ymaps = window.ymaps,
            init = () => {
                // Создание карты
                const map = new ymaps.Map("map", {
                    // Координаты центра карты
                    // Порядок по умолчанию: «широта, долгота»
                    center: [55.76, 37.64],

                    // Уровень масштабирования. Допустимые значения:
                    // от 0 (весь мир) до 19
                    zoom: 10
                }),
                // Создание геообъекта с типом полилиния
                polyline = new ymaps.Polyline([]);

                // Размещение геообъекта на карте
                map.geoObjects.add(polyline);

                window.map = map;
                window.polyline = polyline;
            }

        ymaps.ready(init);
    }


    // Добавление узла
    addNode = (e) => {
        // Отменить перезагрузку страницы по отправке формы
        e.preventDefault();

        const ymaps = window.ymaps,
            map = window.map,
            mapCenter = map.getCenter(),
            nodesCopy = [...this.state.nodes],
            polyline = window.polyline,
            polylineLength = polyline.geometry.getLength(),
            inputElem = document.getElementById('placemark-name'),
            placemarkName = inputElem.value,
            placemark = new ymaps.Placemark(mapCenter,
                {
                    index: polylineLength,
                    balloonContent:
                        `<div class="balloon-body">
                            <span>${placemarkName}</span>
                        </div>`
                },
                {
                    preset: 'islands#blueDotIcon',
                    draggable: true
                }
            ),
            newNode = {
                placemark: placemark,
                name: placemarkName
            };

        placemark.events
            .add('dragend', () => this.changeCoordinates(placemark))
            .add('mouseenter', () => placemark.options.set('preset', 'islands#redDotIcon'))
            .add(['mouseleave', 'balloonclose'], () => placemark.options.set('preset', 'islands#blueDotIcon'));

        // Очистить поле ввода после добавления точки
        inputElem.value = '';

        // Добавление маркера и узла линии на карту
        map.geoObjects.add(placemark);
        polyline.geometry.set(polylineLength, mapCenter)

        nodesCopy.push(newNode);

        this.setState({ nodes: nodesCopy })
    }


    // Удаление узла
    removeNode = (placemark) => {
        const map = window.map,
            polyline = window.polyline,
            nodesCopy = [...this.state.nodes],
            placemarkIndex = placemark.properties.get('index');

        // Удаление маркера и узла линии с карты
        map.geoObjects.remove(placemark);
        polyline.geometry.remove(placemarkIndex);

        nodesCopy.splice(placemarkIndex, 1);
        nodesCopy.forEach((node, index) => node.placemark.properties.set('index', index))

        this.setState({ nodes: nodesCopy })
    }


    // Корректировка положения узла линии
    changeCoordinates = (placemark) => {
        const polyline = window.polyline,
            newCoordinates = placemark.geometry.getCoordinates(),
            placemarkIndex = placemark.properties.get('index');

        polyline.geometry.set(placemarkIndex, newCoordinates);
    }


    // Реализация поведения Drag'n'Drop
    // Идея взята отсюда: https://bit.ly/2sZAiAJ
    onDragStart = (e, index) => {
        const draggedItem = this.state.nodes[index];

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);

        this.setState({ draggedItem })
    };


    onDragOver = (e, index) => {
        e.preventDefault();

        const { nodes, draggedItem, markedItem } = this.state,
            draggedOverItem = nodes[index];

        // Если объект находится сам над собой - ничего не делать
        if (draggedItem === draggedOverItem) {
            return;
        } else {
            // Отфильтровать перетаскиваемый объект
            const updNodes = nodes.filter(node => node !== draggedItem);

            // Добавить перетаскиваемый объект на место указываемого
            updNodes.splice(index, 0, draggedItem);

            if (markedItem) markedItem.classList.remove('dragged');
            e.currentTarget.classList.add('dragged');

            this.setState({ nodes: updNodes, markedItem: e.currentTarget });
        }
    };


    onDragEnd = () => {
        const { nodes, markedItem } = this.state,
            polyline = window.polyline;

        // Обновить геометрию на карте
        nodes.forEach((node, index) => {
            node.placemark.properties.set('index', index)

            polyline.geometry.set(index, node.placemark.geometry.getCoordinates())
        })

        if (markedItem) markedItem.classList.remove('dragged');

        this.setState({ draggedItem: null, markedItem: null });
    };


    render() {
        const { nodes } = this.state;

        return (
            <div className="App">

                <NodeList
                    nodes={nodes}
                    addNode={this.addNode}
                    removeNode={this.removeNode}
                    dragStart={this.onDragStart}
                    dragOver={this.onDragOver}
                    dragEnd={this.onDragEnd}
                />

                <div id="map" style={{width: '100%', height: '100%'}}></div>

            </div>
        );
    }
}

export default App;
