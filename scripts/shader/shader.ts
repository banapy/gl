export let Shader = [
    {
        id: 1,
        vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                uniform vec2 u_resolution;
                attribute vec2 a_position;
                void main(){
                    vec2 clipSpace = pixelToClipSpace(a_position,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                }
            `,
        fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color;
            }   
        `
    },
    {
        id: 2,
        vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                attribute vec2 a_textCoord;
                attribute vec2 a_position;
                varying vec2 v_textCoord;
                uniform vec2 u_resolution;
                void main(){
                    vec2 clipSpace = pixelToClipSpace(a_position,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                    v_textCoord = a_textCoord;
                }
            `,
        fs: `
            precision mediump float;
            vec4 mediumPixel(sampler2D u_image,vec2 v_textCoord,vec2 u_textureSize){
                vec2 onePixel = vec2(1.0,1.0) / u_textureSize;
                vec4 tempColor =   (
                    texture2D(u_image, v_textCoord) +
                    texture2D(u_image, v_textCoord + vec2(onePixel.x,0.0)) +
                    texture2D(u_image, v_textCoord + vec2(-onePixel.x,0.0))
                ) / 3.0;
                return tempColor;
            }
            uniform sampler2D u_image;
            uniform vec2 u_textureSize;
            varying vec2 v_textCoord;
            void main() {
                gl_FragColor = mediumPixel(u_image,v_textCoord,u_textureSize);
       
            }
        `
    },
    {
        id: 3,
        vs: `
                vec2 pixelToClipSpace(vec2 position,vec2 resolution){
                    return ((position / resolution )*2.0-1.0)*vec2(1,-1);
                }
                vec2 rotatedPosition(vec2 a_position,vec2 u_rotation){
                    return vec2(
                        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
                        a_position.y * u_rotation.y - a_position.x * u_rotation.x
                    );
                }
                vec2 scaledPosition(vec2 a_position,vec2 u_scale){
                    return a_position*u_scale;
                }
                attribute vec2 a_position;
                uniform vec2 u_translation;
                uniform vec2 u_resolution;
                uniform vec2 u_rotation;
                uniform vec2 u_scale;
                void main(){
                    vec2 scledPosition = scaledPosition(a_position,u_scale);
                    vec2 rotatedPosition = rotatedPosition(scledPosition,u_rotation);
                    vec2 clipSpace = pixelToClipSpace(rotatedPosition+u_translation,u_resolution);
                    gl_Position = vec4(clipSpace,0.0,1);
                }
            `,
        fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color ;
            }
        `
    },
    {
        id: 4,
        vs: `
                attribute vec2 a_position;
                uniform mat3 u_modelMatrix;
                void main(){
                    vec2 modelPosition = (u_modelMatrix*vec3(a_position,1)).xy;
                    gl_Position = vec4(modelPosition,0.0,1);
                }
            `,
        fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color ;
            }
        `
    },
    {
        id: 5,
        vs: `
                attribute vec3 a_position;
                uniform mat4 u_modelMatrix;
                void main(){
                    vec3 modelPosition = (u_modelMatrix*vec4(a_position,1)).xyz;
                    gl_Position = vec4(modelPosition,1);
                }
            `,
        fs: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor =u_color ;
            }
        `
    },
]