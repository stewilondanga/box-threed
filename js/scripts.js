var navigate = (function() {
  $('.dd').toggle();
  $('.dd_btn').click(function() {
    var dataName = $(this).attr('data-name');
    $('.dd').hide();
    $('.' + dataName).toggle();
  });
})();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
} // Boostrap for WebGL and Attaching Shaders //
// Fragment & Vertex Shaders in HTML window //
//
class Render {
  constructor() {
    _defineProperty(this, "createCanvas",









      name => {
        this.canvas =
          document.getElementById(name) || document.createElement("canvas");
        this.canvas.id = name;
        if (!document.getElementById(name)) {
          document.body.appendChild(this.canvas);
        }
        const context = this.canvas.getContext("webgl2");
        if (!context) {
          console.error("no webgl avaiable");
        }
        this.setViewport();
      });
    _defineProperty(this, "setViewport",


      () => {
        this.width = ~~(document.documentElement.clientWidth,
          window.innerWidth || 0);
        this.height = ~~(document.documentElement.clientHeight,
          window.innerHeight || 0);
        this.gl = this.canvas.getContext("webgl");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.gl.viewport(0, 0, this.width, this.height);
        this.clearCanvas();
      });
    _defineProperty(this, "createShader",


      (type, source) => {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!success) {
          console.log(this.gl.getShaderInfoLog(shader));
          this.gl.deleteShader(shader);
          return false;
        }
        return shader;
      });
    _defineProperty(this, "createWebGL",

      (vertexSource, fragmentSource) => {
        // Setup Vertext/Fragment Shader functions
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = this.createShader(
          this.gl.FRAGMENT_SHADER,
          fragmentSource);


        // Setup Program and Attach Shader functions
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
          console.warn(
            "Unable to initialize the shader program: " +
            this.gl.getProgramInfoLog(this.program));

          return null;
        }

        // Create and Bind buffer //
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]),
          this.gl.STATIC_DRAW);


        const vPosition = this.gl.getAttribLocation(this.program, "vPosition");

        this.gl.enableVertexAttribArray(vPosition);
        this.gl.vertexAttribPointer(
          vPosition,
          2, // size: 2 components per iteration
          this.gl.FLOAT, // type: the data is 32bit floats
          false, // normalize: don't normalize the data
          0, // stride: 0 = move forward size * sizeof(type) each iteration to get the next position
          0 // start at the beginning of the buffer
        );

        this.clearCanvas();
        this.importUniforms();
      });
    _defineProperty(this, "clearCanvas",

      () => {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      });
    _defineProperty(this, "importUniforms",

      () => {
        let width = ~~(document.documentElement.clientWidth,
          window.innerWidth || 0);
        let height = ~~(document.documentElement.clientHeight,
          window.innerHeight || 0);
        if (!this.hiRez) {
          width = ~~(width * 0.5);
          height = ~~(height * 0.5);
        }
        this.resolution = new Float32Array([width, height]);
        this.gl.uniform2fv(
          this.gl.getUniformLocation(this.program, "resolution"),
          this.resolution);

        // get the uniform ins from the shader fragments
        this.ut = this.gl.getUniformLocation(this.program, "time");
      });
    _defineProperty(this, "updateUniforms",

      () => {
        this.gl.uniform1f(this.ut, (Date.now() - this.start) / 1000);
        this.gl.drawArrays(
          this.gl.TRIANGLE_FAN, // primitiveType
          0, // Offset
          4 // Count
        );
      });
    _defineProperty(this, "init",


      () => {
        this.createWebGL(
          document.getElementById("vertexShader").textContent,
          document.getElementById("fragmentShader").textContent);

        this.renderLoop();
      });
    _defineProperty(this, "renderLoop",

      () => {
        this.updateUniforms();
        this.animation = window.requestAnimationFrame(this.renderLoop);
      });
    this.hiRez = true; // change for hi-rez output
    this.start = Date.now(); // Setup WebGL canvas and surface object //
    // Make Canvas and get WebGl2 Context //
    let _width = this.width = ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    let _height = this.height = ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    const canvas = this.canvas = document.createElement("canvas");
    canvas.id = "GLShaders";
    if (!this.hiRez) {
      _width = ~~(_width * 0.5);
      _height = ~~(_height * 0.5);
    }
    canvas.width = _width;
    canvas.height = _height;
    document.body.appendChild(canvas);
    const gl = this.gl = canvas.getContext("webgl2");
    if (!gl) {
      console.warn("WebGL 2 is not available.");
      return;
    } // WebGl and WebGl2 Extension //
    this.gl.getExtension("OES_standard_derivatives");
    this.gl.getExtension("EXT_shader_texture_lod");
    this.gl.getExtension("OES_texture_float");
    this.gl.getExtension("WEBGL_color_buffer_float");
    this.gl.getExtension("OES_texture_float_linear");
    this.gl.viewport(0, 0, canvas.width, canvas.height); // always nice to let people resize
    window.addEventListener("resize", () => {
      let width = ~~(document.documentElement.clientWidth, window.innerWidth || 0);
      let height = ~~(document.documentElement.clientHeight, window.innerHeight || 0);
      if (!this.hiRez) {
        width = ~~(width * 0.5);
        height = ~~(height * 0.5);
      }
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.resolution = new Float32Array([this.canvas.width, this.canvas.height]);
      this.gl.uniform2fv(this.gl.getUniformLocation(this.program, "resolution"), this.resolution);
      this.clearCanvas();
    }, false);
    this.init();
  } // Canvas Helper Function //
}
const demo = new Render(document.body);
