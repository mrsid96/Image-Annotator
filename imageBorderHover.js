class ImageBorderHover {
    constructor({
        annotatorMap,
        imageId,
        canvasId,
        tableId,
        annotateColor,
        annotateOpacity,
    }) {
        if (!imageId) {
            throw Error("Image ID is a required parameter!");
        }
        this.annotatorMap = annotatorMap || [
            {
                rawText: "Job Purpose",
                coordinates: [
                    { x: 10, y: 10 }, { x: 80, y: 10 },
                    { x: 10, y: 40 }, { x: 80, y: 40 }
                ]
            },
            {
                rawText: "Duties Mark",
                coordinates: [
                    { x: 10, y: 80 }, { x: 80, y: 80 },
                    { x: 10, y: 110 }, { x: 80, y: 110 }
                ]
            },
            {
                rawText: "Job Purpose",
                coordinates: [
                    { x: 10, y: 200 }, { x: 80, y: 200 },
                    { x: 10, y: 240 }, { x: 80, y: 240 }
                ]
            }
        ];
        this.canvasId = canvasId || "annotatorCanvas";
        this.tableId = tableId || "annotatorTable";
        this.imageId = imageId;
        this.annotateColor = annotateColor || "#FF0000";
        this.annotateOpacity = annotateOpacity || 0.5;
        this.workOnTable(tableId);
        this.workOnCanvas(canvasId);
        this.workOnAnnotations();
    }

    workOnTable = (tableId) => {
        if (!tableId) {
            this.createDefaultTable();
        }
    }

    workOnCanvas = async (canvasId) => {
        if (!canvasId) {
            this.createDefaultCanvas();
        }
        const canvasElement = window.document.getElementById(this.canvasId);
        const imageElement = window.document.getElementById(this.imageId);
        //Setting the canvas height and width with that of image
        imageElement.style.position = "absolute";
        imageElement.style.zIndex = "-1";
        canvasElement.width = imageElement.width;
        canvasElement.height = imageElement.height;

    }

    normalizeCanvasParams = ([point1, point2, point3, point4]) => {
        const width = point2.x - point1.x;
        const height = point3.y - point1.y;
        return [point1.x, point1.y, width, height];
    }

    plotMarkings = (points) => {
        const canvasElement = window.document.getElementById(this.canvasId);
        const ctx = canvasElement.getContext("2d");
        ctx.fillStyle = this.annotateColor;
        ctx.globalAlpha = this.annotateOpacity;
        ctx.fillRect(...this.normalizeCanvasParams(points));
    }

    removeMarkings = (points) => {
        const canvasElement = window.document.getElementById(this.canvasId);
        const ctx = canvasElement.getContext("2d");
        ctx.clearRect(...this.normalizeCanvasParams(points));
    }

    workOnAnnotations = () => {
        /*
        1. Iterate through all the annotation and attach a record in table
        2. Attach event listener on the each record, when highlighted, 
            2.a When hover in: draw a canvas on image, with transparent background
            2.b when hover out: remove the canvas on image
        */
        this.annotatorMap.forEach(annotation => {
            const record = window.document.createElement("div")
            record.id = `annotation-${Date.now()}`;
            record.innerHTML = annotation.rawText;
            record.classList.add("defaultTableItem");
            record.addEventListener("mouseover", (e) => {
                this.plotMarkings(annotation.coordinates);
            });
            record.addEventListener("mouseout", (e) => {
                this.removeMarkings(annotation.coordinates);
            });
            window.document.getElementById(this.tableId).appendChild(record);
        });
    }

    createDefaultCanvas = () => {
        const canvasElement = window.document.createElement("canvas");
        canvasElement.id = this.canvasId;
        window.document.body.appendChild(canvasElement);
    }

    createDefaultTable = () => {
        const tableElement = window.document.createElement("div");
        tableElement.id = this.tableId;
        tableElement.classList.add("defaultTable");
        window.document.body.appendChild(tableElement);
    }
}