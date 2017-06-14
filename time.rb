require 'rubygems'
require 'tzinfo'

time = Time.now.utc
TIME_FORMAT_24 = '%H:%M'.freeze
TIME_FORMAT_12 = '%I:%M %p'.freeze

def zone_print(hour_offset)
  daylight_savings = Time.now.dst?
  neg_pos = hour_offset > 0 ? '+' : '-'
  hour = daylight_savings ? hour_offset + 1 : hour_offset
  hour_print = "#{neg_pos}#{hour.abs.to_s.rjust(2, '0')}"
  "#{hour_print}:00"
end

def time_print(time, time_name, time_zone)
  localtime = time.localtime(time_zone).strftime(TIME_FORMAT_24)
  localtime_12h = time.localtime(time_zone).strftime(TIME_FORMAT_12)
  "#{time_name} - #{localtime} - #{localtime_12h}"
end

puts "#{time.strftime(TIME_FORMAT_24)} UTC"
puts '---'
zones = {
  Memphis: -6,
  Merrisa: -5,
  Sensorly: 1
}
zones.each do |k, v|
  puts time_print(time, k, zone_print(v))
end
