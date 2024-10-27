import fbx

def get_animation_frame_range(fbx_file):
    manager = fbx.FbxManager.Create()
    importer = fbx.FbxImporter.Create(manager, "")
    
    if not importer.Initialize(fbx_file, -1):
        print("Failed to initialize FBX importer.")
        return None

    scene = fbx.FbxScene.Create(manager, "Scene")
    importer.Import(scene)
    importer.Destroy()

    # Get the animation stack
    anim_stack = scene.GetCurrentAnimationStack()
    anim_layer = anim_stack.GetMember(0)  # First animation layer

    # Get the time span of the animation
    time_span = anim_stack.GetLocalTimeSpan()
    start = time_span.GetStart().GetFrameCount()
    end = time_span.GetStop().GetFrameCount()

    print(f"Animation starts at frame: {start}, ends at frame: {end}")
    manager.Destroy()

# Usage
get_animation_frame_range("public/models/Woman/FBX/WomanUnity.fbx")
