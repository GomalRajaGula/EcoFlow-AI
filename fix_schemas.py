with open('backend/app/schemas/base.py', 'r') as f:
    content = f.read()

# Finding the duplicated part
first_user_base = content.find("class UserBase(BaseModel):")
second_user_base = content.find("class UserBase(BaseModel):", first_user_base + 1)

if second_user_base != -1:
    # Everything after the first block but before the second import block
    # It looks like the imports and User/Batch schemas were duplicated
    
    first_import = content.find("from pydantic import BaseModel, Field, field_validator")
    second_import = content.find("from pydantic import BaseModel, Field, field_validator", first_import + 1)
    
    if second_import != -1:
        # Keep only from second import to end
        cleaned = content[second_import:]
        
        # However, there's another duplication at the end
        first_fermentation_log = cleaned.find("class FermentationLog(FermentationLogBase):")
        second_fermentation_log = cleaned.find("class FermentationLog(FermentationLogBase):", first_fermentation_log + 1)
        
        if second_fermentation_log != -1:
            cleaned = cleaned[:second_fermentation_log]
        
        with open('backend/app/schemas/base.py', 'w') as f:
            f.write(cleaned)
        print("Fixed schemas duplicated content")
