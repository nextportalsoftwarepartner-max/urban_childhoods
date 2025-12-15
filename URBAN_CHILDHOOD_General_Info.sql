/* Execute App Development */
cd D:\CHIANWEILON\Software_Dev\Urban_Childhood\Source_Code; if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }; if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }; if (Test-Path .expo) { Remove-Item -Recurse -Force .expo }; if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }
cd D:\CHIANWEILON\Software_Dev\Urban_Childhood\Source_Code;
npm install
npx expo install --fix
npx expo start --clear

git checkout feature/home_tab_20251215_v1
git checkout feature/Developmental_tab_v1
git checkout -b feature/lets_do_it_tab_v1

git pull origin feature/lets_do_it_tab_v1



/* push to enhancement github features */
git push -u origin feature/lets_do_it_tab_v1

git commit -m "xxx"

/* If there are uncommitted changes, commit them: */
git add .
git commit -m "Developmental Changes - Added Video Guidance URL to make it user friendly in teaching and practice"
git push -u origin feature/Developmental_tab_v1

/* merge my changes in feature/home_tab_v1 into main */
/* Step 1: Make sure all changes are committed
First, ensure all your work is committed on the feature branch: */
git status
/* If there are uncommitted changes, commit them: */
git add .git commit -m "Your commit message"

/* Step 2: Switch to main branch */
git checkout main

/* Step 3: Pull latest changes (if working with others or syncing) */
git pull origin main

/* Step 4: Merge your feature branch */
git merge feature/Developmental_tab_v1
/* If there are no conflicts, Git will create a merge commit automatically. */

/* Step 5: Push the merged main branch to GitHub */
git push origin main

/* Step 6: (Optional) Clean up - Delete the feature branch
Delete local branch: */
git branch -d feature/home_tab_v1
/* Delete remote branch: */
git push origin --delete feature/home_tab_v1


cd D:\CHIANWEILON\Software_Dev\Urban_Childhood;
git add .
git commit -m "To sync for missing files"
git push origin main
