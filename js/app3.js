const margin = ({top: 10, right: 120, bottom: 10, left: 40})
const width = 1200
const dy = width / 6
const dx = 10

const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
const tree = d3.tree().nodeSize([dx, dy])

const treeData = function(inData) {

    let numLevels = 0
    inData.forEach(d => {
        const temp = Object.keys(d).length
        if (temp > numLevels) numLevels = temp
    })
    console.log("numLevels: ", numLevels)
    //console.log("inData: ", inData)
    let structure = {}
    
    function splitLayer(data, layerNum, arr) {
        let temp = []
        let nestedData = []
        if (arr !== undefined) {
            nestedData = d3.nest()
                .key(d => d.ref)
                .entries(arr)
            nestedData.forEach(d => {
                d.name = d.key
                d.children = d.values
                delete d.key
                delete d.values
            })
            console.log("nestedData: ", nestedData)
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

//d3.json("../data/flare.json").then(function(data){
d3.csv("../data/enelx_5levels.csv").then(function(csvData){

    const data = treeData(csvData)
    console.log("data: ", data)
    const root = d3.hierarchy(data)

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    //const svg = d3.create("svg")
    const svg = d3.select("#chart").append("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "10px sans-serif")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", d => {
            d.children = d.children ? null : d._children;
            update(d);
            });

        nodeEnter.append("circle")
            .attr("r", 2.5)
            .attr("fill", d => d._children ? "#555" : "#999")
            .attr("stroke-width", 10);

        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -6 : 6)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data.name)
        .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
        });
    }

    update(root);

    svg.node();
    

})