function list_child_processes () {
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 13585;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 13585 > /dev/null;
done;

for child in $(list_child_processes 13586);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/macieklazar/Documents/ReactApp-main/ReactApp.Server/bin/Debug/net8.0/db885e5a5607431cb31cdd5012afd9ea.sh;
