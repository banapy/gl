vec2 pixelToClipSpace(vec2 position,vec2 resolution){
    return((position/resolution)*2.-1.)*vec2(1,-1);
}
uniform vec2 u_resolution;
attribute vec2 a_position;
void main(){
    vec2 clipSpace=pixelToClipSpace(a_position,u_resolution);
    gl_Position=vec4(clipSpace,0.,1);
}