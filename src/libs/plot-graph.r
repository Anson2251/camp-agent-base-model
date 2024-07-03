# Libs
library(jsonlite)
library(ggplot2)
library(reshape2)

args <- commandArgs(trailingOnly = TRUE)
print(args)

json_file_path <- args[1]
diagram_file_path <- args[2]

json_data <- fromJSON(readLines(json_file_path))
# Extract and convert the 'data' part to a data frame
data_list <- json_data$data
data_df <- do.call(rbind, lapply(data_list, as.data.frame))

# Extract meta information
meta_info <- json_data$meta

# Plot the data
plot <- ggplot(data_df) +
    geom_line(aes(x = 1:nrow(data_df), y = susceptibleAgentNum, color = "Susceptible"), linewidth = 1.2) +
    geom_line(aes(x = 1:nrow(data_df), y = recoveredAgentNum, color = "Recovered"), linewidth = 1.2) +
    geom_line(aes(x = 1:nrow(data_df), y = infectedAgentNum, color = "Infected"), linewidth = 1.2) +
    labs(title = "Agent Status Over Time",
        x = "Time",
        y = "Number of Agents",
        color = "Agent Status") +
    theme(
        panel.background = element_rect(fill = "white", color = NA),       # Background color of the plotting area
        panel.grid.major = element_line(linewidth = 0.5, linetype = 'solid', colour = "grey"),
        panel.grid.minor = element_line(linewidth = 0.25, linetype = 'solid', colour = "grey"),
        plot.title = element_text(size = 20, face = "bold"),
        axis.title.x = element_text(size = 16),
        axis.title.y = element_text(size = 16),
        legend.title = element_text(size = 14),
        legend.text = element_text(size = 12)
    ) + 
    scale_color_manual(values = c("Susceptible" = "blue", "Recovered" = "darkgreen", "Infected" = "red"))

ggsave(diagram_file_path, plot = plot, width = 8, height = 6)
