# Sinking of the Unsikable
### Summary - 
This application visualizes the passenger data of Titanic. It shows the age distribution of all passengers, their gender, and using the age & gender, the user can filter seat class, their company and embarkment wise deaths and survival of titanic passengers.
Without using any interactivity(filtering) it is clear from the visualization that most on-boarded were from age of 18 to 40, almost 2/3 of them were Male. More-over, most of the people who died were seated on 3rd class seats, were traveling alone, and embarked the ship from Southhampton. Now the users can filter on Age groups(first: histogram chart) and Gender (second: pie chart) to further drill down to this information.

### Design - 
This application contains 5 charts, 2 of them can filter the data & remaining 3 of them are filterable. User can select one filter at a time. Data is placed in the data folder, but due to browser security issue, i've hosted the file at "https://raw.githubusercontent.com/chaudharybilal/unskinable/master/data/titanic-data.csv" and used this location in my code.

###### After getting some of the feedback, (some in soft form) I've made few changes and they are 

- Added Deselection: To deselect the selected filter, user will have to select the selection again.
- Added Animation: To show the tranisition of filtered data.
- Data & Charts are properly labeled.
- Added chart titles
- Charts show formatted tooltip.
- Formatted the background & chart containers with gradient colors
- Made the tooltips more readable
- Added custom Sorting and custom colors
- Changed the locations of chart container


### Feedback - 
Following are the feedback:
#### User1: 
> It looks great, but charts should be porperly labeled. 
- What do you notice in the visualization? 
> I noticed that mostly people embarked the titanic were from ages of 18 to 36.
- What questions do you have about the data? 
> Is this the complete passenger data?
- What relationships do you notice? 
> I notice, that even though most poeple were embarked from Southhampton, and most of them died, but  most of the females who embarked from southhampton survived.
- What do you think is the main takeaway from this visualization? 
>  The focus of the recusing party were mostly women and people from first class seats.
Is there something you don’t understand in the graphic? 
> Not really.

  #### User2:
  > umm.... I think the filterable charts should show "hand cursor" also they should appear top of filtered charts.
- What do you notice in the visualization? 
> I noticed that Male population on Titanic was almost double of females.
- What relationships do you notice?
> The survival ratio for women is always higher than males in almost every case.
- What do you think is the main takeaway from this visualization?
> I think this shows a pretty clear image of the demographics of peoples of titanic.  
  
  #### User3:
  > I think it is a good visualization, but a light border around the the chart containers would look nicer also, the background can go a liiter lighter I think.
- What do you notice in the visualization? 
> Charts???
- What questions do you have about the data?
> Does this data includes the data from crew members as well?
- What relationships do you notice?
> I don't get what kind of relationship are we talking about here.
- What do you think is the main takeaway from this visualization?
> I think this visualization clearly portrays that most of the people died were from 3rd class seats, were travelling alone, and they boarded the ship from Southampton.
-  Is there something you don’t understand in the graphic? 
> No!

  
### Resources -
I used a combo of D3 & Dimple Js. Other than these, I've used Ajax & google fonts api. The data is loaded in /data folder, and index.html, css and js of initail draft are placed in initial_draft folder.
 Data is placed in the data folder, but due to browser security issue, i've hosted the file at "https://raw.githubusercontent.com/chaudharybilal/unskinable/master/data/titanic-data.csv" and used this location in my code.
