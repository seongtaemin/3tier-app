import os
import re

dir_path = r'c:\Users\admin\Desktop\3tier-app'
for filename in os.listdir(dir_path):
    if filename.endswith('.yaml'):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # The bad markers look like:
        # <<<<<<< HEAD
        #   namespace: 3tier-app-27
        # =======
        #   namespace: 3tier-app-27
        # >>>>>>> ... or without >>>>>>> (since my past script might have broken it)

        # Let's cleanly fix them. 
        # Pattern to find the conflict block for namespace
        pattern1 = re.compile(r'<<<<<<< HEAD\s*(.*?)\s*=======\s*(.*?)\s*(?:>>>>>>>[^\n]*\n|$)', re.DOTALL)
        
        # We will replace the whole conflict block with the first part (or second, since they seem identical for namespace)
        new_content = re.sub(pattern1, r'\1\n', content)
        
        # Catch any stray ======= or <<<<<<<
        new_content = re.sub(r'<<<<<<< HEAD\n', '', new_content)
        new_content = re.sub(r'=======\n', '', new_content)
        new_content = re.sub(r'>>>>>>>.*\n', '', new_content)

        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed {filename}')
