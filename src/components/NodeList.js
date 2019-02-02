import React, { Component } from 'react';

class NodeList extends Component {

    expandList = (list) => {
        list.classList.toggle('visible')
    }

    render() {
        const { nodes, addNode, removeNode,
            dragStart, dragOver, dragEnd } = this.props;

        return (
            <div className="control-panel">
                <form
                    id="add-node"
                    onSubmit={addNode}
                >
                    <label
                        title="Введите название новой точки"
                        htmlFor="placemark-name"
                    >
                        Добавить новую точку:
                    </label>

                    <div className="input-wrapper">
                        <input
                            id="placemark-name"
                            type="text"
                            autoComplete="off"
                            required={true}
                            placeholder="Название точки"
                        />
                        <button type="submit" title="Добавить">+</button>
                    </div>
                </form>

                <h3>Список точек</h3>
                {nodes.length === 0 ?
                <span>Точек пока нет</span> :
                <ol className="node-list">
                    {nodes.map((node, index) => (
                        <li
                            key={index}
                            className="node-item"
                            onDragOver={(e) => dragOver(e, index)}
                        >
                            <div
                                className="drag"
                                draggable
                                onDragStart={e => dragStart(e, index)}
                                onDragEnd={dragEnd}
                            >
                                <div className="arrows"></div>
                                <div className="substrate"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            <span className="node-name">{node.name}</span>
                            <button className="delete-node" title="Удалить точку" onClick={() => removeNode(node.placemark)}>
                                <i className="bar"></i>
                                <i className="bar"></i>
                            </button>
                        </li>
                    ))}
                </ol>
                }

                {/* Responsive Design */}
                {/* Для просмотра на узких экранах - панель точек открывается по клику */}
                <div id="expand-note">
                    <span>Показать список точек</span>
                </div>
                <button
                    id="expand-list"
                    onClick={(e) => this.expandList(e.currentTarget.parentNode)}
                >
                    <span className="expand-arrow"></span>
                </button>
            </div>
        );
    }
}

export default NodeList;
