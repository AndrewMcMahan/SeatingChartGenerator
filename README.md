# Band/Orchestra Seating Chart Generator
A web-based application for creating seating charts for concert bands, orchestras, and similar large performing ensembles.


## Introduction
This project is based upon generously released code written by [Brad Greco](https://www.bgreco.net/about).   The inception of this project, and all code written up to at least April 2016 was written by [Mr. Greco](https://www.bgreco.net/about).   To see more of his work, please visit https://www.bgreco.net/


## Demo
An instance of this application is currently available at https://www.bgreco.net/band/

## Installation / Setup
To install and setup this application for use, simply place all of the files in a directory accessible to a webserver.   Then, point your browser to scgen.html.

To download the files via git and then use git to keep your installation up-to-date, follow these steps:

1. Open a command prompt and change to the directory in which you would like to create the *SeatingChartGenerator* directory.
2. Issue the following command: `git clone https://github.com/AndrewMcMahan/SeatingChartGenerator.git`

At this point, you can easily update your files at any time by opening a command prompt, changing to the *SeatingChartGenerator* directory and issuing the command: `git pull`

## FAQ / Advanced usage
#### Printing
When you print the page using the print link or your browser's Print command, everything on the page except for the chart will be hidden automatically. For best results, print in landscape mode.
Options for removing the extra information on the page (date, URL, page number) can be found in your browser's print settings.
#### Partial rows / hidden chairs
Chairs may be hidden or shown by clicking on them. Hidden chairs are indicated by a large grey square on the screen, but will be completely hidden when printing.
To create a partial row, first create a full row with more chairs than you need and then hide some of the chairs.
#### Music stands
Stands will be displayed when the show music stands checkbox is selected. The small gray boxes indicate where stands can be placed, click inside these boxes to turn the stands on or off. The boxes themselves will be hidden when printing.
To create a row with only music stands (for percussion, etc), first create a normal row and then hide all the chairs by clicking on each one.
#### Saving charts
If you want to save your chart settings to use later, click the save this chart link at the bottom. A code will appear containing all the information needed to rebuild the current chart. Copy the code and save it somewhere on your computer. Next time you want to return to your saved chart, click the load saved chart link and paste in the code that you saved.

## Changelog
The changelog is included within the project itself.   For example, it can be accessed from the [working demo](https://www.bgreco.net/band/) via the link marked *"Help / About"*

## License
Permission to use the source code in this project is granted under the Creative Commons Attribution 3.0 Unported (CC BY 3.0) license. Visit http://creativecommons.org/licenses/by/3.0/ for a summary of what rights are granted under this license.
