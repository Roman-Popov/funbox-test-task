describe('Тесты', () => {
    let uniqueIds, currentId;

    const createNode = () => {
        const form = document.getElementById('add-node'),
            input = document.getElementById('placemark-name'),
            index = currentId,
            submit = new Event("submit", {bubbles: true, cancelable: true, key: 'Enter'});

        input.value = `Тестовая точка ${index + 1}, id: ${uniqueIds[currentId]}`;
        form.dispatchEvent(submit)

        currentId++;
    }

    beforeAll(() => {
        uniqueIds = [...new Array(5)].map(el => '_' + Math.random().toString(36).substr(2, 9));
        currentId = 0;
    })

    describe('1. Яндекс-карта загружена', () => {
        it('1.1 Объект ymaps определен', () => {
            expect(ymaps).toBeDefined();
        });
        it('1.2 Объект map определен', () => {
            expect(map).toBeDefined();
        });
        it('1.3 Объект polyline определен', () => {
            expect(polyline).toBeDefined();
        });
        it('1.4 Объект polyline имеет индекс 0 в составе объектов карты', () => {
            expect(polyline).toBe(map.geoObjects.get(0));
        });
    });


    describe('2. Добавление новой точки маршрута', () => {
        let listItems, initialListLength;

        beforeAll (() => {
            listItems = document.querySelectorAll('.node-list .node-item');
            initialListLength = listItems.length;
            createNode();
        });


        it('2.1 Точка отображается в конце списка уже добавленных точек', () => {
            const newListLength = document.querySelectorAll('.node-list .node-item').length;

            expect(newListLength).toBe(initialListLength + 1);
        });


        it('2.2 В текущем центре карты появился маркер', () => {
            const center = map.getCenter(),
            lastIndex = map.geoObjects.getLength() - 1,
            placemarkCoord = map.geoObjects.get(lastIndex).geometry.getCoordinates();

            expect(center).toEqual(placemarkCoord);
        });
    });


    describe('3. Удаление точки маршрута', () => {
        beforeAll(() => {
            createNode();
        });

        // Восстановить удаленную точку после теста
        afterAll(() => {
            currentId--;
            createNode();
        })


        it('3.1 Напротив каждой точки маршрута отображается кнопка удаления', () => {
            const listItems = document.querySelectorAll('.node-list .node-item'),
                deleteButtons = document.querySelectorAll('.node-list .delete-node');

            deleteButtons.forEach((button, index) =>
                expect(button.parentElement).toBe(listItems[index])
            )
        });


        it('3.2 При нажатии кнопки удаления, точка маршрута пропадает из списка и с карты', () => {
            const listItems = document.querySelectorAll('.node-list .node-item'),
                deleteButtons = document.querySelectorAll('.node-list .delete-node'),
                geoObjects = map.geoObjects,
                initialListLength = listItems.length,
                initialGeoObjLength = geoObjects.getLength();

            let newListLength, newGeoObjLength;

            deleteButtons[initialListLength - 1].click();

            newListLength = document.querySelectorAll('.node-list .node-item').length;
            newGeoObjLength = geoObjects.getLength();

            expect(newListLength).toBe(initialListLength - 1);
            expect(newGeoObjLength).toBe(initialGeoObjLength - 1);
        });
    });


    describe('4. Функционирование карты', () => {
        let previousMarkerCoordinates,
            testMarkers,
            testListItems;

        const getPlacemarkCoords = () => {
            const geoLength =  map.geoObjects.getLength(),
                startIndex = geoLength - currentId,
                placemarkCoordinates = [];

            for (let i = startIndex; i < geoLength; i++) {
                placemarkCoordinates.push(map.geoObjects.get(i).geometry.getCoordinates())
            }
            return placemarkCoordinates
        }

        const getLineCoords = () => {
            const polyline = map.geoObjects.get(0),
                polylineCoordinates = JSON.parse(JSON.stringify(polyline.geometry.getCoordinates())),
                polylineLength = polylineCoordinates.length,
                startIndex = polylineLength - currentId;

            return polylineCoordinates.splice(startIndex, currentId);
        }


        const getTestListArr = () => {
            const listItems = [...document.querySelectorAll('.node-list .node-item')],
                testNodesArr = [];

            listItems.filter((item, index) => {
                if (uniqueIds.some(id => item.innerText.includes(id))) {
                    testNodesArr.push({
                        index: index,
                        listItem: item,
                        dragGrip: item.querySelector('.drag'),
                        deleteButton: item.querySelector('.delete-node')
                    })
                    return true
                }
            })
            return testNodesArr
        }


        beforeAll (() => {
            previousMarkerCoordinates = getPlacemarkCoords();

            testMarkers = [];
            testListItems = [];

            for (let i = currentId; i < uniqueIds.length ; i++) {
                const geoObj = map.geoObjects;

                createNode();
                testMarkers.push(geoObj.get(geoObj.getLength() - 1))
                // Получить последний добавленный элемент списка
                testListItems.push([...document.querySelectorAll('.node-list .node-item')].pop())
            }
        });


        it('4.1 Маршрут редактируется при перетаскивании маркеров', () => {
            const initialCoordinates = getPlacemarkCoords(),
                // Копирование массива исходных координат для дальнейшего независимого изменения
                computedPlacemarkCoordinates = JSON.parse(JSON.stringify(previousMarkerCoordinates));

            let actualPlacemarkCoordinates;

            // Разнесение маркеров
            testMarkers.forEach(marker => {
                const initialCoords = marker.geometry.getCoordinates(),
                    deltaX = Math.random() > 0.5 ? Math.random() * 0.15 : Math.random() * -1 * 0.15,
                    deltaY = Math.random() > 0.5 ? Math.random() * 0.15 : Math.random() * -1 * 0.15,
                    newCoords = [initialCoords[0] + deltaX, initialCoords[1] + deltaY];

                marker.geometry.setCoordinates(newCoords);
                marker.events.fire('dragend');
                computedPlacemarkCoordinates.push(newCoords)
            })

            actualPlacemarkCoordinates = getPlacemarkCoords();

            expect(initialCoordinates).not.toEqual(actualPlacemarkCoordinates)
            expect(actualPlacemarkCoordinates).toEqual(computedPlacemarkCoordinates)
        })


        it('4.2 Маркеры совпадают с узлами полилинии', () => {
            const lineCoordinates = getLineCoords(),
                placemarkCoordinates = getPlacemarkCoords();

            expect(lineCoordinates).toEqual(placemarkCoordinates)
        })


        it('4.3 Маркеры на карте расположены в том же порядке, что и в списке', () => {
            const testListItemNames = testListItems.map(elem => elem.innerText.trim()),
                indexOfFirstMarker = map.geoObjects.getLength() - testListItemNames.length;

            testListItemNames.forEach((name, index) => {
                const placemark = map.geoObjects.get(indexOfFirstMarker + index),
                    placemarkText = placemark.properties.get('balloonContent');

                expect(placemarkText.includes(name)).toBe(true)
            })
        })


        it('4.4 Маршрут изменяется при изменении порядкка точек в списке', () => {
            const testNodesArr = getTestListArr(),
                lineCoordinates = JSON.parse(JSON.stringify(map.geoObjects.get(0).geometry.getCoordinates()))
                dragStartIndex = Math.round(Math.random() * (testNodesArr.length - 1)),
                dragStart = new DragEvent("dragstart", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()}),
                dragOver = new DragEvent("dragover", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()}),
                dragEnd = new DragEvent("dragend", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()});

            let actualLineCoordinates, draggedCoordinates, dragOverIndex;

            // Во избежание перетаскивания над самим собой
            dragOverIndex = (() => {
                let index;
                do {
                    index = Math.round(Math.random() * (testNodesArr.length - 1));
                } while (index === dragStartIndex);
                return index
            })()

            testNodesArr[dragStartIndex].dragGrip.dispatchEvent(dragStart);
            testNodesArr[dragOverIndex].listItem.dispatchEvent(dragOver);
            testNodesArr[dragStartIndex].dragGrip.dispatchEvent(dragEnd);

            // Предполагаемое изменение массива исходных координат
            draggedCoordinates = lineCoordinates.splice(testNodesArr[dragStartIndex].index, 1);
            lineCoordinates.splice(testNodesArr[dragOverIndex].index, 0, draggedCoordinates[0]);

            actualLineCoordinates = map.geoObjects.get(0).geometry.getCoordinates()

            expect(actualLineCoordinates).toEqual(lineCoordinates)
        });


        it('4.5 При клике на маркер появляется балун с названием соответсвующей точки', done => {
            const lastTestNode = getTestListArr().pop(),
                lastNodeName = lastTestNode.listItem.innerText.trim(),
                polyline = map.geoObjects.get(0),
                polylineCoords = polyline.geometry.getCoordinates(),
                lastCoords = polylineCoords[polyline.geometry.getLength() - 1],
                placemarkCoords = getPlacemarkCoords(),
                oldLength = document.querySelectorAll('.node-list .node-item').length - currentId,
                markerIndex = placemarkCoords.findIndex(elem => JSON.stringify(elem) === JSON.stringify(lastCoords)) + oldLength,
                // index - порядок в списке. +1 - т.к. нулевой объект - полилиния
                lastPlacemark = map.geoObjects.get(markerIndex + 1)

            lastPlacemark.events.once('balloonopen', () => {
                const lastPlacemarkName = document.querySelector('.balloon-body').innerText.trim();
                expect(lastNodeName).toBe(lastPlacemarkName);
                lastPlacemark.events.fire('click');
                done();
            });

            lastPlacemark.events.fire('click');
        });


        it('4.6 При удалении точки изменяется маршрут', () => {
            const testNodesArr = getTestListArr(),
                lineCoordinates = getLineCoords(),
                oldLength = document.querySelectorAll('.node-list .node-item').length - currentId,
                deleteIndex = Math.round(Math.random() * (testNodesArr.length - 1));

            let actualLineCoordinates;

            testNodesArr[deleteIndex].deleteButton.click();
            currentId--;
            lineCoordinates.splice(testNodesArr[deleteIndex].index - oldLength, 1);
            testNodesArr.splice(deleteIndex, 1);

            actualLineCoordinates = getLineCoords();

            expect(actualLineCoordinates).toEqual(lineCoordinates)
        });
    })
})
