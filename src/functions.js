function satellite_rot(model,rot_ang,rot_axis,origin,
			           translation,scaling){

				//Create quaternion 
				let rot_quat = glMatrix.quat.create(); 
				glMatrix.quat.setAxisAngle(rot_quat, rot_axis, rot_ang); 
				 
				//Create rotation matrix from quaternion 
				let rot = glMatrix.mat4.create(); 
				glMatrix.mat4.fromRotationTranslationScaleOrigin 
				(rot, rot_quat,translation, scaling, origin) ; 
				 
				//Apply rotation 
				glMatrix.mat4.multiply(model,rot,model); 
				
				
				/*//invert rotation matrix  
				var rot_inv = glMatrix.mat4.create(); 
				glMatrix.mat4.invert(rot_inv,rot); 
				//Can be nice effect around origin = (0,0,0) but else uncontrollable
				//glMatrix.mat4.multiply(pl_mesh.model,glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model),rot_inv);
				
				*/
				/*
				// // Rodrigues hardcode around 0,1,0 //
				
				//Create quaternion
				var theta = 0.05;//deltaTime/5.0 %(2.0*Math.PI);
				var s = Math.cos(theta/2.0);
				var x = Math.sin(theta/2.0)*0.0; //
				var y = Math.sin(theta/2.0)*1.0;
				var z = Math.sin(theta/2.0)*0.0;
				
				//Create rotation matrix from quaternion
				var rot = glMatrix.mat4.fromValues
				(1.0-2.0*y*y-2.0*z*z, 2.0*x*y-2.0*s*z,2.0*x*z+2.0*s*y, 0.0,
				2.0*x*y+2.0*s*z,1.0-2.0*x*x-2.0*z*z, 2.0*y*z-2.0*s*x,0.0,
				2.0*x*z-2.0*s*y, 2.0*y*z+2.0*s*x, 1.0-2.0*x*x-2.0*y*y,0.0,
				0.0,0.0,0.0,1.0);
				
				//Invert it
				var rot_inv = glMatrix.mat4.create();
				glMatrix.mat4.invert(rot_inv,rot);
				
				//Rotate
				//glMatrix.mat4.multiply(pl_mesh.model,glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model),rot_inv);
				//glMatrix.mat4.multiply(pl_mesh.model,rot,pl_mesh.model);
				
				*/
}