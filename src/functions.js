function satellite_rot(model,rot_ang,rot_axis,origin,translation,scaling){

				//Create quaternion from angle and axis
				let rot_quat = glMatrix.quat.create(); 
				glMatrix.quat.setAxisAngle(rot_quat, rot_axis, rot_ang); 
				 
				//Create rotation matrix from quaternion 
				let rot = glMatrix.mat4.create(); 
				glMatrix.mat4.fromRotationTranslationScaleOrigin 
				(rot, rot_quat,translation, scaling, origin) ; 
				 
				//Apply rotation 
				glMatrix.mat4.multiply(model,rot,model); 
				
}

function moveObjectKey(doc,model,y,keys){
	doc.addEventListener('keydown', (event) => {
		  const key = event.key;
		  
		//Up Down Right Left Front Back
		  if (key === "0" || key === 'o') {
			//Robot goes up
			glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, y, 0.0));

			return;
		  }
		   else if (key === "1" || key === 'l') {
		   //Robot goes down
		    glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, -y, 0.0));
			return;

		}
		else if ( key === 'm') {
		///Robot goes right
		 glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(-y, 0.0, 0.0));
		 return;
 
		} else if (key === 'k') {
			//Robot goes left
			glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(y, 0.0, 0.0));
			return;
	 
		} else if (key === 'i') {
			//Robot goes front
			glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, 0.0, -y));
			return;
	 
		} else if  (key === 'p') {
			//Robot goes back
			glMatrix.mat4.translate(model, model, glMatrix.vec3.fromValues(0.0, 0.0, y));
			return;
	 
		}

},false);
}



function checkCollisions(colliders_list,r_collider, others, r_other){
	//contains all objects in collision
	//if two spheres have are separated by a distance < their radius they are added
	var in_collision = [];
	//for each pair of objects in colliders_list check if they collide
	for(let j = 0; j < colliders_list.length; j++){
		//hitbox has size < 16 while model is size 16
		if (colliders_list[j].length < 16 == false){
		//position = last column 
		//  /!\ here matrix 4x4 = vetor 1x16
			pos_j = glMatrix.vec3.fromValues(colliders_list[j][12],
											 colliders_list[j][13],
											 colliders_list[j][14]);
			glMatrix.vec3.negate(pos_j,pos_j);
		}
		
		else{
			pos_j = [];
			for (let l = 0; l < colliders_list[j][0].length; l++){
				//hitbox is the first element in the list
				let pos_l = glMatrix.vec3.fromValues(colliders_list[j][0][l][12],
													 colliders_list[j][0][l][13],
													 colliders_list[j][0][l][14]);
				glMatrix.vec3.negate(pos_l,pos_l);
				pos_j.push(pos_l);
			}
		}
		
		//Second loop to check for the pairs in collision
		for (let i = 0; i < colliders_list.length; i++){
			//Every object collides with itself don't take into account
			if(i != j){
			//If hitbox check for each sphere of the hitbox if collision	
			if (colliders_list[i].length < 16){
				for(let k = 0; k < colliders_list[i][0].length; k++){
					//hitbox is the first element in the list
					var pos_k = glMatrix.vec3.fromValues(colliders_list[i][0][k][12],
														 colliders_list[i][0][k][13],
														 colliders_list[i][0][k][14]);
					var sub =glMatrix.vec3.create();
					
					
					if(others.includes(colliders_list[j]) ){
						// sub = distance vector between objects
						glMatrix.vec3.add( sub, pos_k,pos_j);
						
						if (glMatrix.vec3.len(sub) < r_other + colliders_list[i][1][k]){
							in_collision.push(colliders_list[j],colliders_list[i][2]);	
						}
					}
					
					else if(colliders_list[j].length < 16 == false){
						// sub = distance vector between objects
						glMatrix.vec3.add( sub, pos_k,pos_j);
						
						if (glMatrix.vec3.len(sub) < r_collider + colliders_list[i][1][k]){
							in_collision.push(colliders_list[j],colliders_list[i][2]);	
							}
					}
					
					else if (colliders_list[j].length < 16 ){
						
						for (let m = 0; m < pos_j.length; m++){
							// sub = distance vector between objects
							glMatrix.vec3.add( sub, pos_k,pos_j[m]);
							
							if (glMatrix.vec3.len(sub) < colliders_list[j][1][m] + colliders_list[i][1][k]){
								in_collision.push(colliders_list[j][2],colliders_list[i][2]);	
							}
						}
					}
					
					
				}
			}
			else{
				//position = last column 
				//  /!\ here matrix 4x4 = vetor 1x16
				let pos_i = glMatrix.vec3.fromValues(colliders_list[i][12],
													colliders_list[i][13],
													colliders_list[i][14]);
															
				//Create a vector with norm > 	r_collider+ r_other																	
				let sub =glMatrix.vec3.create();
				// sub = distance vector between objects
				glMatrix.vec3.add( sub, pos_i,pos_j);
				
				// object other has a different radius must be taken into account 
				// => 3 cases
				if(others.includes(colliders_list[j]) && others.includes(colliders_list[i])){
					if (glMatrix.vec3.len(sub) < 2.0* r_other){
						in_collision.push(colliders_list[j],colliders_list[i]);	
					}
				}
				else if(others.includes(colliders_list[j]) || others.includes(colliders_list[i])){
					if (glMatrix.vec3.len(sub) < r_collider + r_other){
						in_collision.push(colliders_list[j],colliders_list[i]);	
					}
				}
				else{
					if (glMatrix.vec3.len(sub) < 2.0*r_collider ){
						in_collision.push(colliders_list[j],colliders_list[i]);
					}
				}
			}		
		
		}
		}
	}

	return in_collision;
}

class Particle {
	//Note position,velocity and orientation should be glMatrix.vec3
	//color should be a glMatrix.vec4
	//life is a float
	//category determined if the particle stays near the center or flies away
	constructor(position, velocity, orientation, color, life){
		this.position = position;
		this.velocity = velocity;
		this.orientation = orientation;
		this.color = color;
		this.life = life;
		this.size = 0.001;
		this.category = Math.floor(Math.random()*1.8);
	}

	update_part(part_added, new_part){
		this.life = this.life - 0.005;
        if(this.life > 0.0){
            this.position = glMatrix.vec3.scaleAndAdd(this.position,this.position,this.velocity,0.005);
			//more red and outside
			if (this.category == 0){
				
				this.color[1] = this.color[1] - 0.005 * 1.0
            	this.color[2] = this.color[2] - 0.005 * 1.5
			} 
			//more yellow and inside
			else {
				this.color[1] = this.color[1] - 0.005 * 1.0
            	this.color[2] = this.color[2] - 0.005 * 4.0
			}
            
			
            this.size = Math.min(this.life/900, 0.001) 
			return false;
        }
        else{
          if(part_added <= new_part){
            
			if(this.category == 0){
				//red-external part of fire
				this.life = Math.random()*3.0;
				this.position = glMatrix.vec3.random(this.position,0.45)
				this.velocity = glMatrix.vec3.fromValues(Math.random()*0.6 - 0.3,0.4,Math.random()*0.6 - 0.3);
				this.color = glMatrix.vec4.fromValues(1.0,0.6,0.4,1.0);
			}else{
				//yellow-internal part of fire	
				this.life = Math.random()*0.8;
				this.position = glMatrix.vec3.random(this.position,0.35)
				this.velocity = glMatrix.vec3.fromValues(Math.random()*1.0 - 0.5,Math.random()*2.2 - 0.3,Math.random()*1.0 - 0.5);
				this.color = glMatrix.vec4.fromValues(1.0,1.0,1.0,1.0);
			}		
            this.orientation = glMatrix.vec3.random(this.orientation,1.0);
            
            this.size = 0.001
            return true;
          }
                    
        }
	}
}


async function makeHitbox(object_model, relative_positions, scalings,context){
	var hitbox = []
	var hitbox_models = [];
	//load the sphere
	var sphere = await load_obj('../objects/sphere_smooth.obj');
	//each relative position matches a sphere => make one per position
	for (let i = 0; i < relative_positions.length; i++){
        let s1_mesh = await make_object(context, sphere);
		//sphere position = object position + relative position
		s1_mesh.model[12] = object_model[12]+ relative_positions[i][0];
		s1_mesh.model[13] = object_model[13]+ relative_positions[i][1];
		s1_mesh.model[14] = object_model[14]+ relative_positions[i][2];
		//scale the sphere 
		glMatrix.mat4.scale(s1_mesh.model,s1_mesh.model,glMatrix.vec3.fromValues(scalings[i],scalings[i],scalings[i]));									
		hitbox_models.push(s1_mesh.model);
	}
		hitbox.push(hitbox_models,scalings,object_model);
		//having the scalings allow a quick acces to the sphere radius 
return hitbox;
	

}

function updateHitbox(hitbox,relative_positions){
	//moves the hitbox according to its object
	for (let i = 0; i < hitbox[0].length; i++){
		hitbox[0][i][12] =hitbox[2][12]+ relative_positions[i][0];
	    hitbox[0][i][13] =hitbox[2][13]+ relative_positions[i][1];
	    hitbox[0][i][14] =hitbox[2][14]+ relative_positions[i][2];
	}
}

