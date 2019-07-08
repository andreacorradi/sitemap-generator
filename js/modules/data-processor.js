function DataProcessor() {
    self = this

    self.process = function(inData) {

        let numLevels = 0 //number of columns of the source csv file
        inData.forEach(d => { //calculate numLevels
            const temp = Object.keys(d).length
            if (temp > numLevels) numLevels = temp
        })
        console.log("numLevels: ", numLevels)
        //console.log("inData: ", inData)
        let structure = {} //output to be processed by the tree drawing tree 
        
        function splitLayer(data, layerNum, arr) {
            let temp = []
            let nestedData = []
            if (arr !== undefined) { //if not first layer (penultimate column)
                nestedData = d3.nest()
                    .key(d => d.ref)
                    .entries(arr)
                nestedData.forEach(d => {
                    d.name = d.key
                    d.children = d.values
                    delete d.key
                    delete d.values
                })
                //console.log("nestedData: ", nestedData)
            }
            data.forEach((d, i) => {
                let emptyNodeTest = false
                let endNodeTest = false
                d["livello" + layerNum] === "" ? emptyNodeTest = true : emptyNodeTest = false
                d["livello" + (layerNum + 1)] === "" ? endNodeTest = true : endNodeTest = false
                
                if (!emptyNodeTest) {   //level empty > do nothing
                    if (endNodeTest) { //next level empty (no children) > create a "name, value" obj
                        temp.push({
                            name: d["livello" + layerNum],
                            ref: d["livello" + (layerNum - 1)],
                            value: 0
                        })
                    } else { //next level not empty > create a "name, children" obj or add children to existing obj
                        if (arr === undefined) {
                            let item = temp.find(el => el.name === d["livello" + layerNum])
                            if (item === undefined) {
                                temp.push({
                                    name: d["livello" + layerNum],
                                    ref: d["livello" + (layerNum - 1)],
                                    children: [{
                                        name: d["livello" + (layerNum + 1)],
                                        value: 0
                                    }]
                                })
                            } else {
                                item.children.push({
                                    name: d["livello" + (layerNum + 1)],
                                    value: 0
                                })
                            }
                        } else {
                            let item = nestedData.find(el => el.name === d["livello" + layerNum])
                            let match = temp.find(el => el.name === d["livello" + layerNum])
                            if (match === undefined) {
                                temp.push({
                                    name: item.name,
                                    ref: d["livello" + (layerNum - 1)],
                                    children: item.children
                                })
                            }
                        }
                    } 
                }
            })
            //console.log("temp: ", temp)
            return temp
        }
    
        function makeLayers() {
            let tempArr = undefined
            let father = []
            for (let i = numLevels - 1; i > 1; i--) {
                father = splitLayer(inData, i, tempArr)
                console.log("father: ", father)
                tempArr = JSON.parse(JSON.stringify(father))
            }
            return father
        }
    
        // const layerLastRef = splitLayer(inData, numLevels - 1)
        // console.log("layerLastRef: ", layerLastRef)
        // const pippo = splitLayer(inData, numLevels - 2, layerLastRef)
        // console.log("pippo: ", pippo)
        // const pluto = splitLayer(inData, numLevels - 3, pippo)
        // console.log("pluto: ", pluto)
    
        structure.name = inData[0].livello1
        structure.children = makeLayers()
    
        return structure
    }

    return self
}