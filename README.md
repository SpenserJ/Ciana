Ciana
=====

[![Dependency Status](https://david-dm.org/SpenserJ/Ciana.png)](https://david-dm.org/SpenserJ/Ciana)

Ciana stands for Centralized Information and Notification Appliance, but is
more commonly known as a Status Board. Unlike most status boards however, Ciana
is extremely versatile. If you can think of some information that you would like
to display, and a way of displaying it, you can make it with Ciana.

Possible Uses
-------------

* Analog world clock
* GitHub commit sparkline
* Twitter streams
* RSS feeds
* Word of the day
* Weather
* Calendar
* Google Analytics
* Server Response Times
* Server Statuses

Server Flow
----------

* Initialize the socket
  * When a client sends a message
    * If the message type is 'initialize', check if we've loaded their screen yet.
      * If not, foreach (screen.panels) && foreach (screen.providers)
        * If we've loaded it already, continue
        * If not, load it and cache the results
      * Return the cached panels
* When a file change is detected:
  * If panel template, rebroadcast to all screens using this panel
  * If provider, release and reinitialize provider
  * If screen template, reload clients using that screen
  * If public/scripts/, reload all clients
  * If lib/, reload Ciana
